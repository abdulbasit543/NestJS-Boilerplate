import { Injectable } from '@nestjs/common';
import DatabaseService from 'database/database.service';
import { BooleanResponseDTO } from 'core/response/response.schema';
import { UpdateUserSettingsRequestDTO } from './dto/request/update_user_settings.request';

@Injectable()
export default class UserSettingsService {
    constructor(private _dbService: DatabaseService) {}

    async Update(userId: number, data: UpdateUserSettingsRequestDTO): Promise<BooleanResponseDTO> {
        await this._dbService.userSettings.update({
            where: {
                userId,
            },
            data: {
                ...(data.hasOwnProperty('notificationsEnabled') && {
                    notificationsEnabled: data.notificationsEnabled,
                }),
            },
        });
        return {
            data: true,
        };
    }
}
