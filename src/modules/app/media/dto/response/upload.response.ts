import { ApiProperty } from '@nestjs/swagger';
import { MediaAccess, MediaStatus, MediaType } from '@prisma/client';

export class UploadInitiateMediaResponseDTO {
    @ApiProperty()
    accessKeyId: string;

    @ApiProperty()
    secretAccessKey: string;

    @ApiProperty()
    sessionToken: string;

    @ApiProperty()
    mediaId: number;

    @ApiProperty()
    location: string;

    @ApiProperty()
    bucket: string;

    @ApiProperty()
    region: string;
}

export class UploadFinalizeMediaResponseDTO {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty()
    extension: string;

    @ApiProperty({ enum: MediaType })
    type: MediaType;

    @ApiProperty({ enum: MediaAccess })
    access: MediaAccess;

    @ApiProperty()
    size: number;

    @ApiProperty()
    path: string;

    @ApiProperty()
    thumbPath: string;

    @ApiProperty({ enum: MediaStatus })
    status: MediaStatus;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    meta: any;
}
