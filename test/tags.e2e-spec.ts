import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { UpdateTagDto } from '../src/modules/tags/dto/update-tag.dto';
import { Tag } from '../src/modules/tags/schemas/tag.schema';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Tags Controller (e2e)', () => {
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

  const newTags = [
    {
      _id: 'f53528c0460a017f68186916',
      name: {
        en: 'AI',
        ru: 'ИИ',
      },
      icon: 'https://sample.com/icon.png',
    },
    {
      _id: 'f53528c0460a017f68186917',
    },
  ];

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let refresh_token: string = '';
  let createdUser: User;
  let createdTag: Tag;

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

  describe('Tags', () => {
    it('(POST) - Создание нового тега со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newTags[0])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newTags[0]._id);
          createdTag = res.body;
        });
    });

    it('(POST) - Создание нового тега с минимальными полями', async () => {
      return request(app.getHttpServer())
        .post('/tags')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newTags[1])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newTags[1]._id);
        });
    });

    it('(POST/E) - Создание нового тега без токена', async () => {
      return request(app.getHttpServer()).post('/tags').send(newTags[1]).expect(401);
    });

    it('(GET) - Получить все теги без фильтра', async () => {
      return request(app.getHttpServer())
        .get('/tags')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(newTags.length);
        });
    });

    it('(GET) - Получить все теги с page=1', async () => {
      return request(app.getHttpServer())
        .get('/tags?page=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(0);
        });
    });

    it('(GET) - Получить все теги с limit=1', async () => {
      return request(app.getHttpServer())
        .get('/tags?limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
        });
    });

    it('(GET) - Получить все теги с page=1 и limit=1', async () => {
      return request(app.getHttpServer())
        .get('/tags?page=1&limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
        });
    });

    it(`(GET) - Получить все теги с search=${newTags[0].name?.ru}`, async () => {
      return request(app.getHttpServer())
        .get(encodeURI(`/tags?search=${newTags[0].name?.ru}`))
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].name?.ru).toEqual(newTags[0].name?.ru);
        });
    });

    it('(GET) - Получить тег по ID', async () => {
      return request(app.getHttpServer())
        .get(`/tags/${createdTag._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdTag._id);
        });
    });

    it('(GET/E) - Получить несуществующий тег по ID', async () => {
      return request(app.getHttpServer()).get(`/tags/${clownId}`).expect(404);
    });

    it('(PUT) - Обновить тег по ID', async () => {
      const updateTag: Partial<UpdateTagDto> = {
        name: {
          en: 'Artificial Intelligence',
          ru: 'Искусственный интеллект',
        },
      };
      return request(app.getHttpServer())
        .put(`/tags/${createdTag?._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateTag)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.name).toEqual(updateTag.name);
        });
    });

    it('(PUT/E) - Обновить несуществующий тег по ID', async () => {
      const updateTag: Partial<UpdateTagDto> = {
        name: {
          en: 'Artificial Intelligence',
          ru: 'Искусственный интеллект',
        },
      };
      return request(app.getHttpServer())
        .put(`/tags/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateTag)
        .expect(404);
    });

    it('(PUT/E) - Обновить тег по ID без токена', async () => {
      const updateTag: Partial<UpdateTagDto> = {
        name: {
          en: 'Artificial Intelligence',
          ru: 'Искусственный интеллект',
        },
      };
      return request(app.getHttpServer())
        .put(`/tags/${createdTag?._id}`)
        .send(updateTag)
        .expect(401);
    });

    it('(DELETE) - Удалить тег по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/tags/${createdTag?._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdTag._id);
        });
    });

    it('(DELETE/E) - Удалить несуществующий тег по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/tags/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE/E) - Удалить тег по ID без токена', async () => {
      return request(app.getHttpServer()).delete(`/tags/${newTags[1]._id}`).expect(401);
    });
  });
});
