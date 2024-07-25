import { applyDecorators, Controller, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'core/exceptions/http.exception';

type ApiControllerArgs = {
    path?: string;
    version?: '1' | '2' | ['1', '2'];
    tag?: string;
};

export function ApiController(args: ApiControllerArgs) {
    return applyDecorators(
        ApiTags(args.tag || 'default'),
        Controller(args),
        UseFilters(HttpExceptionFilter),
    );
}
