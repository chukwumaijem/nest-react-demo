import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSchema, Auth } from './schema/auth.schema';
import { hashPassword } from './schema/auth.hooks';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Auth.name,
        useFactory: () => {
          const schema = AuthSchema;
          schema.pre('save', hashPassword);
          return schema;
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
