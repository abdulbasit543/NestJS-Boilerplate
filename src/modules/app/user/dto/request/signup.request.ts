import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserOAuthType } from '@prisma/client';
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
    IsString,
    Length,
    Matches,
    ValidateIf,
} from 'class-validator';

export class SignupRequestDTO {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateIf((obj) => obj.providerId === undefined && obj.providerType === undefined)
    @Length(6, 128)
    password: string;

    @ApiProperty()
    @Length(1, 255)
    name: string;

    @ApiProperty()
    // @IsPhoneNumber('AE')
    @Matches(/^(?:00|\\+)[0-9\\s.\\/-]{6,20}$/, {
        message: 'phone must start with 00 followed by the country code',
    })
    phone: string;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateIf((obj) => obj.password === undefined)
    @IsString()
    providerId?: string;

    @ApiPropertyOptional({ enum: UserOAuthType })
    @IsOptional()
    @ValidateIf((obj) => obj.password === undefined)
    @IsEnum(UserOAuthType)
    providerType?: UserOAuthType;
}
