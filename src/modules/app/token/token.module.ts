import { Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import TokenService from './token.service';

@Module({
    imports: [DatabaseModule],
    exports: [TokenService],
    providers: [TokenService],
    controllers: [],
})
export default class TokenModule {}
