import { INestApplication } from '@nestjs/common';
import { ResponseInterceptor } from 'core/interceptors/response.interceptor';
import { TranslatorService } from 'nestjs-translator';

export default function InjectInterceptors(app: INestApplication) {
    app.useGlobalInterceptors(new ResponseInterceptor(app.get(TranslatorService)));
}
