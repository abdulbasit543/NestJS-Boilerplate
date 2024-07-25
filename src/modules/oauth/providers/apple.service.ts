import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import AppConfig from 'configs/app.config';
import { IOAuth, IOAuthTokenData } from 'core/interfaces';
import { JWK, JWS } from 'node-jose';

@Injectable()
export default class AppleOAuthService implements IOAuth {
    constructor(private _httpService: HttpService) {}

    private async _getPublicKeys() {
        const result = await this._httpService.axiosRef.get(`${AppConfig.OAUTH.APPLE}/auth/keys`);
        return result.data;
    }

    async GetTokenData(token: string): Promise<IOAuthTokenData> {
        const keys = await this._getPublicKeys();
        const keystore = await JWK.asKeyStore(keys);
        const verifiedResult = await JWS.createVerify(keystore).verify(token);
        const data = JSON.parse(verifiedResult.payload.toString());

        return {
            id: data.sub,
            email: data.email,
            type: 'apple',
        };
    }
}
