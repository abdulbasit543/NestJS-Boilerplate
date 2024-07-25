import { ApiProperty } from '@nestjs/swagger';
import { TokenReason } from '@prisma/client';
import { IsEnum, IsInt, IsUUID } from 'class-validator';

export default class CreatePasswordTokenRequestDTO {
    @ApiProperty({ enum: TokenReason })
    @IsEnum(TokenReason)
    reason: TokenReason;

    @ApiProperty()
    @IsUUID('4')
    uuid: string;

    @ApiProperty()
    @IsInt()
    userId: number;
}
