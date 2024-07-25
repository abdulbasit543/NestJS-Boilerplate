import { applyDecorators, SetMetadata } from '@nestjs/common';

export const IGNORE_RESPONSE_INTERCEPTOR = 'IGNORE_RESPONSE_INTERCEPTOR';

export const IgnoreResponseInterceptor = () => {
    return applyDecorators(SetMetadata(IGNORE_RESPONSE_INTERCEPTOR, true));
};
