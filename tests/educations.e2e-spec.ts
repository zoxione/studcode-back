import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { Education } from '../src/modules/educations/schemas/education.schema';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Educations Controller (e2e)', () => {
  let app: INestApplication;
  const clownId = '555555555555555555555555';
  let accessToken: string = '';
  let refreshToken: string = '';
  let createdAdmin: User;
  let createdEducation: Education;
  const admin = {
    _id: 'f53528c0460a017f68186911',
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    role: 'admin',
    password: Math.random().toString(36).substring(7),
  };
  const newEducations = [
    {
      _id: 'f53528c0460a017f68186916',
      abbreviation: 'EDU1',
      name: 'Education1',
      description: 'Education1 description',
      logo: '',
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

  it('(POST) - Создание нового образовательного учреждения со всеми полями', async () => {
    return request(app.getHttpServer())
      .post('/educations')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newEducations[0])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newEducations[0]._id);
        createdEducation = res.body;
      });
  });

  it('(POST) - Создание нового образовательного учреждения с минимальными полями', async () => {
    return request(app.getHttpServer())
      .post('/educations')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newEducations[1])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newEducations[1]._id);
      });
  });

  it('(POST/E) - Создание нового образовательного учреждения без токена', async () => {
    return request(app.getHttpServer()).post('/educations').set('Authorization', 'Bearer ').send(newEducations[1]).expect(401);
  });

  it('(GET) - Получить все образовательные учреждения без фильтра', async () => {
    return request(app.getHttpServer())
      .get('/educations')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(newEducations.length);
      });
  });

  it('(GET) - Получить все образовательные учреждения с page=2', async () => {
    return request(app.getHttpServer())
      .get('/educations?page=2')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(0);
      });
  });

  it('(GET) - Получить все образовательные учреждения с limit=1', async () => {
    return request(app.getHttpServer())
      .get('/educations?limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it('(GET) - Получить все образовательные учреждения с page=2 и limit=1', async () => {
    return request(app.getHttpServer())
      .get('/educations?page=2&limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it(`(GET) - Получить все образовательные учреждения с search=${newEducations[0].name}`, async () => {
    return request(app.getHttpServer())
      .get(encodeURI(`/educations?search=${newEducations[0].name}`))
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].name).toEqual(newEducations[0].name);
      });
  });

  it('(GET) - Получить образовательное учреждение по ID', async () => {
    return request(app.getHttpServer())
      .get(`/educations/${createdEducation._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(createdEducation._id);
      });
  });

  it('(GET/E) - Получить несуществующее образовательное учреждение по ID', async () => {
    return request(app.getHttpServer()).get(`/educations/${clownId}`).expect(404);
  });
});
