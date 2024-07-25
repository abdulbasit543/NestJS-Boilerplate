import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';

export enum OrderDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}

export default class PaginatedRequest {
    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    page: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    limit: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    column: string;

    @ApiPropertyOptional({ enum: OrderDirection })
    @IsOptional()
    @IsEnum(OrderDirection)
    direction: OrderDirection;
}
