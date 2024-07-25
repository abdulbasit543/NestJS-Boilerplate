import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsEnum } from 'class-validator';
import PaginatedRequest from 'core/request/paginated.request';

export default class FindUsersRequestDTO extends PaginatedRequest {
    @ApiPropertyOptional({ enum: UserType })
    @IsEnum(UserType)
    type: UserType;
}
