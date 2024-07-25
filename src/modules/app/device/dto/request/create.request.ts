import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DeviceType } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, Length } from 'class-validator';

export default class CreateDeviceRequestDTO {
    @ApiProperty({ enum: DeviceType })
    @IsEnum(DeviceType)
    type: DeviceType;

    @ApiProperty()
    @IsInt()
    userId: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Length(1, 255)
    userAgent?: string;
}
