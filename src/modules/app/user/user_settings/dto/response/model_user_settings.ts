import { ApiProperty } from '@nestjs/swagger';

export class UserSettingsModel {
    @ApiProperty()
    notificationsEnabled: boolean;
}
