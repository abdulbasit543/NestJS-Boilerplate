import { ApiProperty } from '@nestjs/swagger';
import { UserStatus, UserType } from '@prisma/client';
import { MediaResponseModel } from 'modules/app/media/dto/response/model';

export class UserResponseModel {
    @ApiProperty()
    id: number;

    @ApiProperty()
    name: string;

    @ApiProperty({ enum: UserType })
    type?: UserType;

    @ApiProperty()
    email?: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty({ enum: UserStatus })
    status?: UserStatus;

    @ApiProperty()
    profilePictureId?: number;

    @ApiProperty()
    profilePicture?: MediaResponseModel;
}
