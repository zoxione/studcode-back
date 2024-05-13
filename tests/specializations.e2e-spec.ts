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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(() => {
    mongoose.connect(configuration().database).then(() => {
      mongoose.connection.db.dropDatabase();
    });
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  const user = {
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

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let refresh_token: string = '';
  let createdUser: User;
  let createdSpecialization: Specialization;

  describe('Auth', () => {
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

    it('(POST) - Аутентификация пользователя', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          access_token = res.body.access_token;
          refresh_token = res.body.refresh_token;
        });
    });
  });

  describe('Specializations', () => {
    it('(POST) - Создание новой специализации со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/specializations')
        .set('Authorization', 'Bearer ' + access_token)
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
        .set('Authorization', 'Bearer ' + access_token)
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
});
