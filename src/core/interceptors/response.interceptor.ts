import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { TranslatorService } from 'nestjs-translator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocaleTranslation } from 'i18n';
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    constructor(@Inject(TranslatorService) private _translatorService: TranslatorService) {}

    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<any> | Promise<Observable<any>> {
        let ctx = context.switchToHttp();
        let response: any = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const locale = request.headers['locale'];
        return next.handle().pipe(
            map((data: any) => {
                if (data.Message && data.Message instanceof LocaleTranslation) {
                    data = {
                        ...data,
                        Message: this._translatorService.translate(data.Message.getKey(), {
                            replace: data.Message.getData(),
                            lang: locale,
                        }),
                    };
                }
                response.__ss_body = { ...data };
                return data;
            }),
        );
    }
}
