import { Body } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiController, Authorized, CurrentUser, Post } from 'core/decorators';
import {
    UploadFinalizeMediaRequestDTO,
    UploadInitiateMediaRequestDTO,
} from './dto/request/upload.request';
import {
    UploadFinalizeMediaResponseDTO,
    UploadInitiateMediaResponseDTO,
} from './dto/response/upload.response';
import MediaService from './media.service';

@ApiController({
    path: '/media',
    tag: 'media',
    version: '1',
})
export default class MediaController {
    constructor(private _mediaService: MediaService) {}

    @Post({
        path: '/public/init',
        description: 'Upload public media',
        response: UploadInitiateMediaResponseDTO,
    })
    UploadPublicInitiate(
        @Body() data: UploadInitiateMediaRequestDTO,
    ): Promise<UploadInitiateMediaResponseDTO> {
        return this._mediaService.UploadInitiate(data);
    }

    @Post({
        path: '/public/finalize',
        description: 'Finalize public media',
        response: UploadFinalizeMediaResponseDTO,
    })
    UploadPublicFinalize(
        @Body() data: UploadFinalizeMediaRequestDTO,
    ): Promise<UploadFinalizeMediaResponseDTO> {
        return this._mediaService.UploadFinalize(data);
    }

    @Authorized()
    @Post({
        path: '/init',
        description: 'Upload media',
        response: UploadInitiateMediaResponseDTO,
    })
    UploadInitiate(
        @Body() data: UploadInitiateMediaRequestDTO,
        @CurrentUser() user: User,
    ): Promise<UploadInitiateMediaResponseDTO> {
        return this._mediaService.UploadInitiate(data, user);
    }

    @Authorized()
    @Post({
        path: '/finalize',
        description: 'Finalize media',
        response: UploadFinalizeMediaResponseDTO,
    })
    UploadFinalize(
        @Body() data: UploadFinalizeMediaRequestDTO,
        @CurrentUser() user: User,
    ): Promise<UploadFinalizeMediaResponseDTO> {
        return this._mediaService.UploadFinalize(data, user);
    }
}
