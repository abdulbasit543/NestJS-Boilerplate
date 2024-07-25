import { Body, Param, ParseIntPipe } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { ApiController, Authorized, CurrentUser, Get, Patch } from 'core/decorators';
import { BooleanResponseDTO } from 'core/response/response.schema';
import { UpdateUserSettingsRequestDTO } from './dto/request/update_user_settings.request';
import UserSettingsService from './user_settings.service';

@ApiController({ version: '1', tag: 'user' })
export default class UserSettingsController {
    constructor(private _userSettingsService: UserSettingsService) {}

    @Authorized([UserType.USER])
    @Patch({
        path: '/user/settings',
        response: BooleanResponseDTO,
        description: 'Update user settings',
    })
    async Update(
        @Body() data: UpdateUserSettingsRequestDTO,
        @CurrentUser() user: User,
    ): Promise<BooleanResponseDTO> {
        return this._userSettingsService.Update(user.id, data);
    }
}
