import { ApiProperty } from '@nestjs/swagger';
import { UserResponseModel } from './model';

export default class FindUsersResponseDTO {
    @ApiProperty({ isArray: true, type: UserResponseModel })
    data: UserResponseModel[];

    @ApiProperty()
    count: number;
}
