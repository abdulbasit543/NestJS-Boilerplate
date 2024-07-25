import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExceptionResponse {
    @ApiProperty({ default: 'Bad Request. Check Input' })
    message: string;

    @ApiProperty({ nullable: true, default: null })
    errors: { [key: string]: string };
}
export class NotFoundExceptionResponse {
    @ApiProperty({ default: 'Not Found' })
    message: string;
}
export class ForbiddenExceptionResponse {
    @ApiProperty({ default: 'Access Not Allowed' })
    message: string;
}
export class UnauthorizedExceptionResponse {
    @ApiProperty({ default: 'Not Authorized' })
    message: string;
}
export class FatalErrorExceptionResponse {
    @ApiProperty({ default: 'Something Went Wrong' })
    message: string;
}

export class BooleanResponseDTO {
    @ApiProperty()
    data: boolean;
}

export class StringResponseDTO {
    @ApiProperty()
    data: string;
}
