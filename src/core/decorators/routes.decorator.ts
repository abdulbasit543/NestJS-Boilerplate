import {
    applyDecorators,
    HttpStatus,
    Put as NestPut,
    Get as NestGet,
    Post as NestPost,
    Patch as NestPatch,
    Delete as NestDelete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
    BadRequestExceptionResponse,
    FatalErrorExceptionResponse,
    ForbiddenExceptionResponse,
    NotFoundExceptionResponse,
    UnauthorizedExceptionResponse,
} from 'core/response/response.schema';

type RouteDecoratorsType = {
    path: string;
    response: Function | any;
    description: string;
};

export function Post(args: RouteDecoratorsType) {
    return applyDecorators(
        ApiResponse({
            type: args.response,
            status: HttpStatus.OK,
        }),
        ApiResponse({
            type: BadRequestExceptionResponse,
            status: HttpStatus.BAD_REQUEST,
        }),
        ApiResponse({
            type: ForbiddenExceptionResponse,
            status: HttpStatus.FORBIDDEN,
        }),
        ApiResponse({
            type: UnauthorizedExceptionResponse,
            status: HttpStatus.UNAUTHORIZED,
        }),
        ApiResponse({
            type: NotFoundExceptionResponse,
            status: HttpStatus.NOT_FOUND,
        }),
        ApiResponse({
            type: FatalErrorExceptionResponse,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
        ApiOperation({summary: args.description}),
        NestPost(args.path),
    );
}

export function Put(args: RouteDecoratorsType) {
    return applyDecorators(
        ApiResponse({
            type: args.response,
            status: HttpStatus.OK,
        }),
        ApiResponse({
            type: BadRequestExceptionResponse,
            status: HttpStatus.BAD_REQUEST,
        }),
        ApiResponse({
            type: ForbiddenExceptionResponse,
            status: HttpStatus.FORBIDDEN,
        }),
        ApiResponse({
            type: UnauthorizedExceptionResponse,
            status: HttpStatus.UNAUTHORIZED,
        }),
        ApiResponse({
            type: NotFoundExceptionResponse,
            status: HttpStatus.NOT_FOUND,
        }),
        ApiResponse({
            type: FatalErrorExceptionResponse,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
        ApiOperation({summary: args.description}),
        NestPut(args.path),
    );
}

export function Patch(args: RouteDecoratorsType) {
    return applyDecorators(
        ApiResponse({
            type: args.response,
            status: HttpStatus.OK,
        }),
        ApiResponse({
            type: BadRequestExceptionResponse,
            status: HttpStatus.BAD_REQUEST,
        }),
        ApiResponse({
            type: ForbiddenExceptionResponse,
            status: HttpStatus.FORBIDDEN,
        }),
        ApiResponse({
            type: UnauthorizedExceptionResponse,
            status: HttpStatus.UNAUTHORIZED,
        }),
        ApiResponse({
            type: NotFoundExceptionResponse,
            status: HttpStatus.NOT_FOUND,
        }),
        ApiResponse({
            type: FatalErrorExceptionResponse,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
        ApiOperation({summary: args.description}),
        NestPatch(args.path),
    );
}

export function Get(args: RouteDecoratorsType) {
    return applyDecorators(
        ApiResponse({
            type: args.response,
            status: HttpStatus.OK,
        }),
        ApiResponse({
            type: BadRequestExceptionResponse,
            status: HttpStatus.BAD_REQUEST,
        }),
        ApiResponse({
            type: ForbiddenExceptionResponse,
            status: HttpStatus.FORBIDDEN,
        }),
        ApiResponse({
            type: UnauthorizedExceptionResponse,
            status: HttpStatus.UNAUTHORIZED,
        }),
        ApiResponse({
            type: NotFoundExceptionResponse,
            status: HttpStatus.NOT_FOUND,
        }),
        ApiResponse({
            type: FatalErrorExceptionResponse,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
        ApiOperation({summary: args.description}),
        NestGet(args.path),
    );
}

export function Delete(args: RouteDecoratorsType) {
    return applyDecorators(
        ApiResponse({
            type: args.response,
            status: HttpStatus.OK,
        }),
        ApiResponse({
            type: BadRequestExceptionResponse,
            status: HttpStatus.BAD_REQUEST,
        }),
        ApiResponse({
            type: ForbiddenExceptionResponse,
            status: HttpStatus.FORBIDDEN,
        }),
        ApiResponse({
            type: UnauthorizedExceptionResponse,
            status: HttpStatus.UNAUTHORIZED,
        }),
        ApiResponse({
            type: NotFoundExceptionResponse,
            status: HttpStatus.NOT_FOUND,
        }),
        ApiResponse({
            type: FatalErrorExceptionResponse,
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
        ApiOperation({summary: args.description}),
        NestDelete(args.path),
    );
}
