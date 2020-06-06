import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { setup } from './setup';

describe('AuthModule Signup (e2e)', () => {
  let app: INestApplication;
  let defaultData: { login: string; password: string };
  let DbCleanUp: any;

  beforeAll(async done => {
    const setupData = await setup();

    app = setupData.app;
    defaultData = setupData.defaultData;
    DbCleanUp = setupData.DbCleanUp;

    done();
  });

  beforeEach(async done => {
    await DbCleanUp.removeCollection();
    done();
  });

  it('should create account if user data is valid', async done => {
    return request(app.getHttpServer())
      .post('/signup')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'Account created.');
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('user.login', defaultData.login);
        done();
      });
  });

  it('should fail if login already exists', async done => {
    await request(app.getHttpServer())
      .post('/signup')
      .send(defaultData);

    return request(app.getHttpServer())
      .post('/signup')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toContain('duplicate key error');
        done();
      });
  });

  it('should fail if login is missing from payload', async done => {
    delete defaultData.login;
    return request(app.getHttpServer())
      .post('/signup')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toContain('Path `login` is required.');
        done();
      });
  });

  it('should fail if login is missing from payload', async done => {
    delete defaultData.password;
    return request(app.getHttpServer())
      .post('/signup')
      .send(defaultData)
      .then(response => {
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('success', false);
        expect(response.body.message).toContain('Path `password` is required.');
        done();
      });
  });

  afterAll(async done => {
    await DbCleanUp.closeConnection();
    await app.close();
    done();
  });
});
