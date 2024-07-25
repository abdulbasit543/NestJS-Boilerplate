import { ApiProperty } from '@nestjs/swagger';

export default class CreatePasswordTokenResponseDTO {
    @ApiProperty()
    token: string;
}
