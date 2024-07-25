import { Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { User, UserType } from '@prisma/client';
import { ApiController, Authorized, CurrentUser, Get, Patch, Post, Put } from 'core/decorators';
import FindUsersRequestDTO from './dto/request/find.request';
import FindUsersResponseDTO from './dto/response/find.response';
import GetUserByIdResponseDTO from './dto/response/getById.response';
import GetMeResponseDTO from './dto/response/me.response';
import UserService from './user.service';

@ApiController({ version: '1', tag: 'user' })
export default class UserController {
    constructor(private _userService: UserService) {}

    @Authorized()
    @Get({
        path: '/user/me',
        description: 'Get current user details',
        response: GetMeResponseDTO,
    })
    GetMe(@CurrentUser() user: User): Promise<GetMeResponseDTO> {
        return this._userService.GetMe(user);
    }

    @Authorized(UserType.ADMIN)
    @Get({
        path: '/users',
        description: 'Get users listing',
        response: FindUsersResponseDTO,
    })
    Find(@Query() data: FindUsersRequestDTO): Promise<FindUsersResponseDTO> {
        return this._userService.Find(data);
    }

    @Authorized()
    @Get({
        path: '/user/:id',
        description: 'Get user by id',
        response: GetUserByIdResponseDTO,
    })
    Get(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: User,
    ): Promise<GetUserByIdResponseDTO> {
        return this._userService.Get(id, user);
    }
}
