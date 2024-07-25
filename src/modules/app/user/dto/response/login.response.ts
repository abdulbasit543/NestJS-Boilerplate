import { ApiProperty } from '@nestjs/swagger';

export default class LoginResponseDTO {
    @ApiProperty({ description: 'Token' })
    token: string;
}
