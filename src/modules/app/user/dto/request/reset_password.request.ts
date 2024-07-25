import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, Length } from 'class-validator';

export default class ResetPasswordRequestDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;

    @ApiProperty()
    @Length(1, 255)
    password: string;
}
