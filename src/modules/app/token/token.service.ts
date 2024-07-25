import { Injectable } from '@nestjs/common';
import { TokenReason } from '@prisma/client';
import DatabaseService from 'database/database.service';
import CreatePasswordTokenRequestDTO from './dto/request/create.request';

@Injectable()
export default class TokenService {
    constructor(private _dbService: DatabaseService) {}

    async CreatePasswordToken(data: CreatePasswordTokenRequestDTO) {
        const token = await this._dbService.token.create({
            data: {
                uuid: data.uuid,
                code: data.uuid,
                reason: data.reason,
            },
        });

        return token.code;
    }

    async GetToken(code: string, reason?: TokenReason) {
        const token = await this._dbService.token.findFirst({
            where: { code, ...(!!reason && { reason }) },
        });
        if (!token) return null;

        return token;
    }
}
