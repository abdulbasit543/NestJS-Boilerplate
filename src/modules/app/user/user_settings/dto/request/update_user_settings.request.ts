import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, ValidateIf } from 'class-validator';

export class UpdateUserSettingsRequestDTO {
    @ApiPropertyOptional()
    @IsBoolean()
    @ValidateIf((object, value) => value !== undefined)
    notificationsEnabled?: boolean;
}
