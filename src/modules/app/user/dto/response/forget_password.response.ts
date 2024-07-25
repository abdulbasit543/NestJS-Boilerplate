import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ForgetPasswordResponseDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;
}

export class ForgetPasswordVerificationResponseDTO {
    @ApiProperty()
    @IsUUID('4')
    token: string;
}
