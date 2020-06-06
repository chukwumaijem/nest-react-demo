import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { setup } from './setup';

describe('AuthModule Login (e2e)', () => {
  let app: INestApplication;
  let defaultData: { login: string; password: string };
  let DbCleanUp: any;

  beforeAll(async done => {
    const setupData = await setup();

    app = setupData.app;
    defaultData = setupData.defaultData;
    DbCleanUp = setupData.DbCleanUp;

    defaultData = {
      login: 'good-username',
      password: 'secure-password',
    };

    await request(app.getHttpServer())
      .post('/signup')
      .send(defaultData);

    done();
  });

  it('should login if "login and password" is valid', async done => {
    return request(app.getHttpServer())
      .post('/login')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Login Succeeded.');
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('user.login', defaultData.login);
        done();
      });
  });

  it('should fail if login is invalid', async done => {
    defaultData.login = 'not-valid';
    return request(app.getHttpServer())
      .post('/login')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Login Failed.');
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('user', null);
        done();
      });
  });

  it('should fail if password is invalid', async done => {
    defaultData.password = 'not-valid';
    return request(app.getHttpServer())
      .post('/login')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Login Failed.');
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('user', null);
        done();
      });
  });

  afterAll(async done => {
    await DbCleanUp.closeConnection();
    await app.close();
    done();
  });
});
