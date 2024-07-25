import { Body } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { ApiController, Post } from 'core/decorators';
import { BooleanResponseDTO } from 'core/response/response.schema';
import {
    ForgetPasswordRequestDTO,
    ForgetPasswordVerificationRequestDTO,
} from './dto/request/forget_password.request';
import LoginRequestDTO from './dto/request/login.request';
import OAuthLoginRequestDTO from './dto/request/oauth_login.request';
import ResetPasswordRequestDTO from './dto/request/reset_password.request';
import { SignupRequestDTO } from './dto/request/signup.request';
import {
    ForgetPasswordResponseDTO,
    ForgetPasswordVerificationResponseDTO,
} from './dto/response/forget_password.response';
import LoginResponseDTO from './dto/response/login.response';
import SignupResponseDTO from './dto/response/signup.response';
import UserService from './user.service';

@ApiController({ version: '1', tag: 'auth', path: '/auth' })
export default class AuthController {
    constructor(private _userService: UserService) {}

    @Post({
        path: '/login/oauth',
        description: 'Login with OAuth apps',
        response: LoginResponseDTO,
    })
    OAuthLogin(@Body() data: OAuthLoginRequestDTO): Promise<LoginResponseDTO> {
        return this._userService.OAuthLogin(data);
    }

    @Post({
        path: '/login',
        description: 'Login to the application',
        response: LoginResponseDTO,
    })
    Login(@Body() data: LoginRequestDTO): Promise<LoginResponseDTO> {
        return this._userService.Login(data);
    }

    @Post({
        path: '/signup',
        description: 'Signup in the application',
        response: SignupResponseDTO,
    })
    Signup(@Body() data: SignupRequestDTO): Promise<SignupResponseDTO> {
        return this._userService.Signup(data);
    }

    @Post({
        path: '/forget-password',
        description: 'Forget password initiate',
        response: ForgetPasswordResponseDTO,
    })
    ForgetPassword(@Body() data: ForgetPasswordRequestDTO): Promise<ForgetPasswordResponseDTO> {
        return this._userService.ForgetPassword(data);
    }

    @Post({
        path: '/forget-password/verification',
        description: 'Forget password verification',
        response: ForgetPasswordVerificationResponseDTO,
    })
    ForgetPasswordVerification(
        @Body() data: ForgetPasswordVerificationRequestDTO,
    ): Promise<ForgetPasswordVerificationResponseDTO> {
        return this._userService.ForgetPasswordVerification(data);
    }

    @Post({
        path: '/reset-password',
        description: 'Forget password initiate',
        response: BooleanResponseDTO,
    })
    ResetPassword(@Body() data: ResetPasswordRequestDTO): Promise<BooleanResponseDTO> {
        return this._userService.ResetPassword(data);
    }
}
