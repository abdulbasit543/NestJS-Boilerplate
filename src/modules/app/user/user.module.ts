import { Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import AuthModule from 'modules/app/auth/auth.module';
import TokenModule from 'modules/app/token/token.module';
import QueueModule from 'modules/queue/queue.module';
import UserSettingsModule from './user_settings/user_settings.module';
import AuthController from './auth.controller';
import UserController from './user.controller';
import UserService from './user.service';
import OAuthModule from 'modules/oauth/oauth.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        TokenModule,
        QueueModule,
        UserSettingsModule,
        OAuthModule,
    ],
    exports: [UserService],
    providers: [UserService],
    controllers: [AuthController, UserController],
})
export default class UserModule {}
