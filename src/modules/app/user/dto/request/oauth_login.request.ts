import { ApiProperty } from '@nestjs/swagger';
import { UserOAuthType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export default class OAuthLoginRequestDTO {
    @ApiProperty()
    @IsString()
    token: string;

    @ApiProperty({ enum: UserOAuthType })
    @IsEnum(UserOAuthType)
    type: UserOAuthType;
}
