import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { Specialization } from '../src/modules/specializations/schemas/specialization.schema';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Specializations Controller (e2e)', () => {
  let app: INestApplication;
  const clownId = '555555555555555555555555';
  let accessToken: string = '';
  let refreshToken: string = '';
  let createdAdmin: User;
  let createdSpecialization: Specialization;
  const admin = {
    _id: 'f53528c0460a017f68186911',
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    role: 'admin',
    password: Math.random().toString(36).substring(7),
  };
  const newSpecializations = [
    {
      _id: 'f53528c0460a017f68186916',
      name: 'Specialization 1',
      description: 'Specialization 1 description',
    },
    {
      _id: 'f53528c0460a017f68186917',
    },
  ];

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

    // Регистрация администратора
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(admin)
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.email).toEqual(admin.email);
        createdAdmin = res.body;
      });

    // Авторизация администратора
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: admin.email, password: admin.password })
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        accessToken = res.body.access_token;
        refreshToken = res.body.refresh_token;
      });
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it('(POST) - Создание новой специализации со всеми полями', async () => {
    return request(app.getHttpServer())
      .post('/specializations')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newSpecializations[0])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newSpecializations[0]._id);
        createdSpecialization = res.body;
      });
  });

  it('(POST) - Создание новой специализации с минимальными полями', async () => {
    return request(app.getHttpServer())
      .post('/specializations')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newSpecializations[1])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newSpecializations[1]._id);
      });
  });

  it('(POST/E) - Создание новой специализации без токена', async () => {
    return request(app.getHttpServer()).post('/specializations').set('Authorization', 'Bearer ').send(newSpecializations[1]).expect(401);
  });

  it('(GET) - Получить все специализации без фильтра', async () => {
    return request(app.getHttpServer())
      .get('/specializations')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(newSpecializations.length);
      });
  });

  it('(GET) - Получить все специализации с page=2', async () => {
    return request(app.getHttpServer())
      .get('/specializations?page=2')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(0);
      });
  });

  it('(GET) - Получить все специализации с limit=1', async () => {
    return request(app.getHttpServer())
      .get('/specializations?limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it('(GET) - Получить все специализации с page=2 и limit=1', async () => {
    return request(app.getHttpServer())
      .get('/specializations?page=2&limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it(`(GET) - Получить все специализации с search=${newSpecializations[0].name}`, async () => {
    return request(app.getHttpServer())
      .get(encodeURI(`/specializations?search=${newSpecializations[0].name}`))
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].name).toEqual(newSpecializations[0].name);
      });
  });

  it('(GET) - Получить специализацию по ID', async () => {
    return request(app.getHttpServer())
      .get(`/specializations/${createdSpecialization._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(createdSpecialization._id);
      });
  });

  it('(GET/E) - Получить несуществующую специализацию по ID', async () => {
    return request(app.getHttpServer()).get(`/specializations/${clownId}`).expect(404);
  });
});
