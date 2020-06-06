import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';

import { AuthModule } from '../src/modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseCleanUpService } from './db.cleanup';

import configuration from '../src/config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let signUpData: { login: string; password: string };
  let DbCleanUp: any;

  beforeEach(async () => {
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

    DbCleanUp = moduleRef.get<DatabaseCleanUpService>(DatabaseCleanUpService);
    await DbCleanUp.removeCollection();

    app = moduleRef.createNestApplication();
    await app.init();
    signUpData = {
      login: 'good-username',
      password: 'secure-password',
    };
  });

  describe('/signup (POST)', () => {
    it('should create account if user data is valid', async done => {
      return request(app.getHttpServer())
        .post('/signup')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('message', 'Account created.');
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('user.login', signUpData.login);
          done();
        });
    });

    it('should fail if login already exists', async done => {
      await request(app.getHttpServer())
        .post('/signup')
        .send(signUpData);

      return request(app.getHttpServer())
        .post('/signup')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('success', false);
          expect(response.body.message).toContain('duplicate key error');
          done();
        });
    });

    it('should fail if login is missing from payload', async done => {
      delete signUpData.login;
      return request(app.getHttpServer())
        .post('/signup')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('success', false);
          expect(response.body.message).toContain('Path `login` is required.');
          done();
        });
    });

    it('should fail if login is missing from payload', async done => {
      delete signUpData.password;
      return request(app.getHttpServer())
        .post('/signup')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('success', false);
          expect(response.body.message).toContain('Path `password` is required.');
          done();
        });
    });
  });

  describe('/login (POST)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/signup')
        .send(signUpData);
    });

    it('should login if "login and password" is valid', async done => {
      return request(app.getHttpServer())
        .post('/login')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('message', 'Login Succeeded.');
          expect(response.body).toHaveProperty('success', true);
          expect(response.body).toHaveProperty('user.login', signUpData.login);
          done();
        });
    });

    it('should fail if login is invalid', async done => {
      signUpData.login = 'not-valid';
      return request(app.getHttpServer())
        .post('/login')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('message', 'Login Failed.');
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('user', null);
          done();
        });
    });

    it('should fail if password is invalid', async done => {
      signUpData.password = 'not-valid';
      return request(app.getHttpServer())
        .post('/login')
        .send(signUpData)
        .then(response => {
          expect(response.status).toBe(201);
          expect(response.body).toHaveProperty('message', 'Login Failed.');
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('user', null);
          done();
        });
    });
  });

  afterAll(async () => {
    await DbCleanUp.dropDatabase();
    await app.close();
  });
});
