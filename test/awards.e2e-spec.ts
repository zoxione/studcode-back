import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { UpdateAwardDto } from '../src/modules/awards/dto/update-award.dto';
import { Award } from '../src/modules/awards/schemas/award.schema';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Awards Controller (e2e)', () => {
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
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    password: Math.random().toString(36).substring(7),
  };

  const newAwards = [
    {
      _id: 'f53528c0460a017f68186116',
      name: {
        en: 'First',
        ru: 'Первый',
      },
      icon: 'https://sample.com/icon.png',
    },
    {
      _id: 'f53528c0460a017f68186117',
    },
  ];

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let refresh_token: string = '';
  let createdUser: User;
  let createdAward: Award;

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

  describe('Awards', () => {
    it('(POST) - Создание новой награды со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/awards')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newAwards[0])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newAwards[0]._id);
          createdAward = res.body;
        });
    });

    it('(POST) - Создание новой награды с минимальными полями', async () => {
      return request(app.getHttpServer())
        .post('/awards')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newAwards[1])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newAwards[1]._id);
        });
    });

    it('(POST/E) - Создание новой награды без токена', async () => {
      return request(app.getHttpServer()).post('/awards').send(newAwards[1]).expect(401);
    });

    it('(GET) - Получить все награды без фильтра', async () => {
      return request(app.getHttpServer())
        .get('/awards')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(newAwards.length);
        });
    });

    it('(GET) - Получить все награды с page=1', async () => {
      return request(app.getHttpServer())
        .get('/awards?page=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(0);
        });
    });

    it('(GET) - Получить все награды с limit=1', async () => {
      return request(app.getHttpServer())
        .get('/awards?limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
        });
    });

    it('(GET) - Получить все награды с page=1 и limit=1', async () => {
      return request(app.getHttpServer())
        .get('/awards?page=1&limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
        });
    });

    it(`(GET) - Получить все награды с search=${newAwards[0].name?.ru}`, async () => {
      return request(app.getHttpServer())
        .get(encodeURI(`/awards?search=${newAwards[0].name?.ru}`))
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].name?.ru).toEqual(newAwards[0].name?.ru);
        });
    });

    it('(GET) - Получить награду по ID', async () => {
      return request(app.getHttpServer())
        .get(`/awards/${createdAward._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdAward._id);
        });
    });

    it('(GET/E) - Получить несуществующую награду по ID', async () => {
      return request(app.getHttpServer()).get(`/awards/${clownId}`).expect(404);
    });

    it('(PUT) - Обновить награду по ID', async () => {
      const updateAward: Partial<UpdateAwardDto> = {
        name: {
          en: 'Mister alligator',
          ru: 'Мистер всезнайка',
        },
      };
      return request(app.getHttpServer())
        .put(`/awards/${createdAward?._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateAward)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.name).toEqual(updateAward.name);
        });
    });

    it('(PUT/E) - Обновить несуществующую награду по ID', async () => {
      const updateAward: Partial<UpdateAwardDto> = {
        name: {
          en: 'Mister alligator',
          ru: 'Мистер всезнайка',
        },
      };
      return request(app.getHttpServer())
        .put(`/awards/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateAward)
        .expect(404);
    });

    it('(PUT/E) - Обновить награду по ID без токена', async () => {
      const updateAward: Partial<UpdateAwardDto> = {
        name: {
          en: 'Mister alligator',
          ru: 'Мистер всезнайка',
        },
      };
      return request(app.getHttpServer())
        .put(`/awards/${createdAward?._id}`)
        .send(updateAward)
        .expect(401);
    });

    it('(DELETE) - Удалить награду по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/awards/${createdAward?._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdAward._id);
        });
    });

    it('(DELETE/E) - Удалить несуществующую награду по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/awards/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE/E) - Удалить награду по ID без токена', async () => {
      return request(app.getHttpServer()).delete(`/awards/${newAwards[1]._id}`).expect(401);
    });
  });
});
