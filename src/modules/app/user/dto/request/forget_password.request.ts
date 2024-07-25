import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsUUID } from 'class-validator';

export class ForgetPasswordRequestDTO {
    @ApiProperty()
    @IsEmail()
    email: string;
}

export class ForgetPasswordVerificationRequestDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;
}
