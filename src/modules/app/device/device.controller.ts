import { Body } from '@nestjs/common';
import { ApiController, Get, Post } from 'core/decorators';
import DeviceService from './device.service';
import CreateDeviceRequestDTO from './dto/request/create.request';
import CreateDeviceResponseDTO from './dto/response/create.response';

@ApiController({
    path: '/device',
    tag: 'device',
    version: '1',
})
export default class DeviceController {
    constructor(private _deviceService: DeviceService) {}

    @Post({
        path: '/',
        description: 'Create a new device',
        response: CreateDeviceResponseDTO,
    })
    Create(@Body() data: CreateDeviceRequestDTO): Promise<CreateDeviceResponseDTO> {
        return this._deviceService.Create(data);
    }
}
