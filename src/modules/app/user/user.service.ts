import { Injectable } from '@nestjs/common';
import { Prisma, TokenReason, User, UserOAuthType, UserStatus, UserType } from '@prisma/client';
import { AVAILABILITY_DAYS, DEFAULT_AVAILABLITY, EmailTemplates } from '../../../constants';
import DatabaseService from 'database/database.service';
import {
    BadRequestException,
    FatalErrorException,
    NotFoundException,
} from 'core/exceptions/response.exception';
import { BooleanResponseDTO } from 'core/response/response.schema';
import {
    ComparePassword,
    ExcludeFields,
    GenerateUUID,
    GetOrderOptions,
    GetPaginationOptions,
    HashPassword,
} from 'helpers/util.helper';
import AuthService from 'modules/app/auth/auth.service';
import TokenService from 'modules/app/token/token.service';
import QueueService from 'modules/queue/queue.service';
import FindUsersRequestDTO from './dto/request/find.request';
import {
    ForgetPasswordRequestDTO,
    ForgetPasswordVerificationRequestDTO,
} from './dto/request/forget_password.request';
import LoginRequestDTO from './dto/request/login.request';
import ResetPasswordRequestDTO from './dto/request/reset_password.request';
import { SignupRequestDTO } from './dto/request/signup.request';
import FindUsersResponseDTO from './dto/response/find.response';
import {
    ForgetPasswordResponseDTO,
    ForgetPasswordVerificationResponseDTO,
} from './dto/response/forget_password.response';
import LoginResponseDTO from './dto/response/login.response';
import SignupResponseDTO from './dto/response/signup.response';
import GetMeResponseDTO from './dto/response/me.response';
import GetUserByIdResponseDTO from './dto/response/getById.response';
import OAuthLoginRequestDTO from './dto/request/oauth_login.request';
import OAuthService from 'modules/oauth/oauth.service';
import { OAuthProviders } from 'core/interfaces';

@Injectable()
export default class UserService {
    constructor(
        private _dbService: DatabaseService,
        private _authService: AuthService,
        private _tokenService: TokenService,
        private _oauthService: OAuthService,
    ) {}

    async Login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
        const user = await this._dbService.user.findFirst({
            where: { email: data.email.toLowerCase() },
            select: { id: true, email: true, password: true },
        });
        if (!user) {
            throw new BadRequestException('auth.invalid_credentials');
        }

        const isPasswordMatched = await ComparePassword(data.password, user.password);
        if (!isPasswordMatched) {
            throw new BadRequestException('auth.invalid_credentials');
        }

        const token = await this._authService.CreateSession(user.id);

        return { token };
    }

    async OAuthLogin(data: OAuthLoginRequestDTO): Promise<LoginResponseDTO> {
        const oauthResult = await this._oauthService.GetTokenData(
            data.token,
            data.type === UserOAuthType.GOOGLE ? 'google' : 'apple',
        );
        if (!oauthResult) {
            throw new BadRequestException('oauth.invalid_token');
        }

        const oauth = await this._dbService.userOAuth.findFirst({
            where: { providerId: oauthResult.id, type: data.type },
            select: { userId: true },
        });
        if (!oauth) {
            throw new NotFoundException('user.not_found');
        }

        const user = await this._dbService.user.findFirst({
            where: { id: oauth.userId },
            select: { id: true },
        });
        if (!user) {
            throw new NotFoundException('user.not_found');
        }

        const token = await this._authService.CreateSession(user.id);

        return { token };
    }

    async Signup(data: SignupRequestDTO): Promise<SignupResponseDTO> {
        const existingUser = await this._dbService.user.findFirst({
            where: { email: data.email },
            select: { id: true },
        });
        if (existingUser) {
            throw new BadRequestException('auth.email_already_exist');
        }

        const isOAuthLogin = data.providerId && data.providerType;

        let email = data.email;
        let providerId = null;
        let providerType = null;

        if (isOAuthLogin) {
            const providerMappings: Record<UserOAuthType, OAuthProviders> = {
                [UserOAuthType.GOOGLE]: 'google',
                [UserOAuthType.APPLE]: 'apple',
            };

            const oauthResult = await this._oauthService.GetTokenData(
                data.providerId,
                providerMappings[data.providerType],
            );
            if (!oauthResult) {
                throw new BadRequestException('oauth.invalid_token');
            }

            email = oauthResult.email;
            providerId = oauthResult.id;
            providerType = oauthResult.type;
        }

        const user = await this._dbService.user.create({
            data: {
                email,
                name: data.name,
                password: isOAuthLogin ? null : await HashPassword(data.password),
                phone: data.phone,
                type: UserType.USER,
                status: UserStatus.ACTIVE,
                settings: {
                    create: {},
                },
                ...(isOAuthLogin && {
                    oauth: {
                        create: {
                            providerId,
                            type:
                                providerType === 'google'
                                    ? UserOAuthType.GOOGLE
                                    : UserOAuthType.APPLE,
                        },
                    },
                }),
            },
            select: { id: true, email: true },
        });

        const token = await this._authService.CreateSession(user.id);

        return { token };
    }

    async ForgetPassword(data: ForgetPasswordRequestDTO): Promise<ForgetPasswordResponseDTO> {
        const user = await this._dbService.user.findFirst({
            where: { email: data.email.toLowerCase() },
        });
        if (!user) {
            throw new BadRequestException('user.not_found');
        }

        const token = await this._tokenService.CreatePasswordToken({
            uuid: GenerateUUID(),
            userId: user.id,
            reason: TokenReason.FORGOT_PASSWORD,
        });

        return { token };
    }

    async ForgetPasswordVerification(
        data: ForgetPasswordVerificationRequestDTO,
    ): Promise<ForgetPasswordVerificationResponseDTO> {
        const token = await this._tokenService.GetToken(data.token, TokenReason.FORGOT_PASSWORD);
        if (!token) {
            throw new BadRequestException('auth.invalid_token');
        }

        const resetToken = await this._tokenService.CreatePasswordToken({
            uuid: GenerateUUID(),
            userId: token.userId,
            reason: TokenReason.RESET_PASSWORD,
        });

        return { token: resetToken };
    }

    async ResetPassword(data: ResetPasswordRequestDTO): Promise<BooleanResponseDTO> {
        const token = await this._tokenService.GetToken(data.token, TokenReason.RESET_PASSWORD);
        if (!token) {
            throw new BadRequestException('auth.invalid_token');
        }

        const encryptedPassword = await HashPassword(data.password);

        await this._dbService.user.update({
            where: { id: token.userId },
            data: { password: encryptedPassword },
        });

        return { data: true };
    }

    async GetMe(user: User): Promise<GetMeResponseDTO> {
        const currentUser = await this._dbService.user.findUnique({
            where: { id: user.id },
            include: {
                settings: true,
                profilePicture: { select: { id: true, path: true, thumbPath: true } },
            },
        });
        return ExcludeFields(currentUser, ['password']);
    }

    async Find(data: FindUsersRequestDTO): Promise<FindUsersResponseDTO> {
        const where: Prisma.UserWhereInput = {
            ...(!!data.type && { type: data.type }),
        };
        const pagination = GetPaginationOptions(data);
        const order = GetOrderOptions(data);

        const users = await this._dbService.user.findMany({
            include: {
                profilePicture: true,
            },
            where,
            ...pagination,
            orderBy: order,
        });

        const count = await this._dbService.user.count({
            where,
        });

        return { data: users, count };
    }

    async Get(id: number, currentUser: User): Promise<GetUserByIdResponseDTO> {
        const basicUser = await this._dbService.user.findFirst({
            where: { id },
            select: { id: true },
        });
        if (!basicUser) {
            throw new NotFoundException('user.not_found');
        }

        const user = await this._dbService.user.findFirst({
            where: { id },
            include: {
                profilePicture: { select: { id: true, path: true, thumbPath: true } },
            },
        });

        return user;
    }
}
