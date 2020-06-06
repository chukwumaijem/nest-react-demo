import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';

import { AuthModule } from '../src/modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCleanUpService } from './db.cleanup';
import configuration from '../src/config';

export async function setup() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [configuration],
        isGlobal: true,
      }),
      MongooseModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get('mongodbTestURI'),
        }),
        inject: [ConfigService],
      }),
      AuthModule,
    ],
    providers: [
      {
        provide: DatabaseCleanUpService,
        useClass: DatabaseCleanUpService,
        inject: [Connection],
      },
    ],
  }).compile();

  const DbCleanUp = moduleRef.get<DatabaseCleanUpService>(DatabaseCleanUpService);

  const app = moduleRef.createNestApplication();
  await app.init();
  const defaultData = {
    login: 'good-username',
    password: 'secure-password',
  };

  return {
    DbCleanUp,
    app,
    defaultData
  }
}
