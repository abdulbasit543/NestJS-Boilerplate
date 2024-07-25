import { ApiProperty } from '@nestjs/swagger';
import { DeviceType } from '@prisma/client';

export default class CreateDeviceResponseDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    uuid: string;

    @ApiProperty()
    userId: number;

    @ApiProperty({ enum: DeviceType })
    type: DeviceType;

    @ApiProperty()
    userAgent: string;
}
