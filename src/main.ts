import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import AppConfig from 'configs/app.config';
import { InjectLogger, InjectSwagger, InjectPipes, InjectInterceptors } from 'core/injectors';
import { AppModule } from './app.module';

async function bootstrap() {
    /* Bootstrap express application */
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
        cors: true,
    });

    /* Enable API versioning */
    app.enableVersioning({ type: VersioningType.URI });

    /* Set proxy as trustful to forward IP address */
    app.set('trust proxy', 1);

    /* Add custom Injectors here */
    InjectPipes(app);
    InjectInterceptors(app);
    InjectLogger(app);
    InjectSwagger(app);

    /* Start the application on a specified port */
    await app.listen(AppConfig.APP.PORT || 3000);
}
bootstrap();
