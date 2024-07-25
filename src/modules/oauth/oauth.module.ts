import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import OAuthService from './oauth.service';
import AppleOAuthService from './providers/apple.service';
import GoogleOAuthService from './providers/google.service';

@Module({
    imports: [HttpModule],
    exports: [OAuthService],
    providers: [OAuthService, GoogleOAuthService, AppleOAuthService],
})
export default class OAuthModule {}
