import { ApiProperty } from '@nestjs/swagger';

export default class SignupResponseDTO {
    @ApiProperty({ description: 'Token' })
    token: string;
}
