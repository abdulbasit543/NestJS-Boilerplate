import { Injectable } from '@nestjs/common';
import DatabaseService from 'database/database.service';

@Injectable()
export default class ChatService {
    constructor(private _dbService: DatabaseService) {}
}
