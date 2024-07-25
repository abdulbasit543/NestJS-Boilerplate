import { Injectable } from '@nestjs/common';
import DatabaseService from 'database/database.service';
import { GenerateUUID } from 'helpers/util.helper';
import CreateDeviceRequestDTO from './dto/request/create.request';
import CreateDeviceResponseDTO from './dto/response/create.response';

@Injectable()
export default class DeviceService {
    constructor(private _dbService: DatabaseService) {}

    async Create(data: CreateDeviceRequestDTO): Promise<CreateDeviceResponseDTO> {
        return await this._dbService.device.create({
            data: {
                uuid: GenerateUUID(),
                type: data.type,
                userId: data.userId,
                userAgent: data.userAgent,
            },
        });
    }

    async FindById(id: number): Promise<CreateDeviceResponseDTO> {
        return await this._dbService.device.findFirst({ where: { id } });
    }

    async FindByUUID(uuid: string): Promise<CreateDeviceResponseDTO> {
        return await this._dbService.device.findFirst({ where: { uuid } });
    }
}
