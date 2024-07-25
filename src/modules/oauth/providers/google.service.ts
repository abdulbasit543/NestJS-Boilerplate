import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import AppConfig from 'configs/app.config';
import { IOAuth, IOAuthTokenData } from 'core/interfaces';

@Injectable()
export default class GoogleOAuthService implements IOAuth {
    constructor(private _httpService: HttpService) {}

    async GetTokenData(token: string): Promise<IOAuthTokenData> {
        const result = await this._httpService.axiosRef.get(
            `${AppConfig.OAUTH.GOOGLE}?id_token=${token}`,
        );

        return {
            id: result.data.sub,
            email: result.data.email,
            type: 'google',
        };
    }
}
