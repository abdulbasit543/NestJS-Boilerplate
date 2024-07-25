import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export default class LoginRequestDTO {
    @ApiProperty({ description: 'Email' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Password' })
    @Length(1, 255)
    password: string;
}
