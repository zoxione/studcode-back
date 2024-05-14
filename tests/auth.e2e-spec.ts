import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;
  const clownId = '555555555555555555555555';
  let accessToken: string = '';
  let refreshToken: string = '';
  let createdUser: User;
  const user = {
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    password: Math.random().toString(36).substring(7),
  };

  beforeAll(async () => {
    // Запуск приложения
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    // Подключение к базе данных
    mongoose.connect(configuration().database).then(() => {
      mongoose.connection.db.dropDatabase();
    });
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it('(POST) - Регистрация нового пользователя', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.email).toEqual(user.email);
        createdUser = res.body;
      });
  });

  it('(POST/E) - Аутентификация пользователя с неверной почтой', async () => {
    return request(app.getHttpServer()).post('/auth/login').send({ email: 'wrong@example.com', password: user.password }).expect(404);
  });

  it('(POST/E) - Аутентификация пользователя с неверным паролем', async () => {
    return request(app.getHttpServer()).post('/auth/login').send({ email: user.email, password: 'wrong' }).expect(401);
  });

  it('(POST) - Аутентификация пользователя', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        accessToken = res.body.access_token;
        refreshToken = res.body.refresh_token;
      });
  });

  it('(GET) - Получение авторизованного пользователя', async () => {
    return request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.email).toEqual(user.email);
      });
  });

  it('(GET/E) - Получение авторизованного пользователя без токена', async () => {
    return request(app.getHttpServer()).get('/auth/whoami').expect(401);
  });

  it('(GET) - Обновление токенов', async () => {
    return request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Authorization', 'Bearer ' + refreshToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        accessToken = res.body.access_token;
        refreshToken = res.body.refresh_token;
      });
  });

  it('(GET/E) - Обновление токенов неверным токеном', async () => {
    return request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(401);
  });

  it('(GET/E) - Обновление токенов без токена', async () => {
    return request(app.getHttpServer()).get('/auth/refresh').expect(401);
  });

  it('(GET/E) - Выход из системы без токена', async () => {
    return request(app.getHttpServer()).get('/auth/logout').expect(401);
  });

  it('(GET) - Выход из системы', async () => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200);
  });
});
