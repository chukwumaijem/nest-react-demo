import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

import { Auth } from '../src/modules/auth/schema/auth.schema';

@Injectable()
export class DatabaseCleanUpService {
  constructor(@InjectConnection() private connection: Connection) {}

  async removeCollection() {
    await this.connection.models[Auth.name].remove({});
  }

  async closeConnection() {
    this.connection.dropDatabase();
  }
}
