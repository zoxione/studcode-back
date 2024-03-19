import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
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
    _id: 'f53528c0460a017f68186911',
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    password: Math.random().toString(36).substring(7),
  };

  const newTags = [
    {
      _id: 'f53528c0460a017f68186916',
      name: 'Tag1',
      icon: '✨',
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
      return request(app.getHttpServer()).post('/tags').set('Authorization', 'Bearer ').send(newTags[1]).expect(401);
    });

    it('(GET) - Получить все теги без фильтра', async () => {
      return request(app.getHttpServer())
        .get('/tags')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newTags.length);
        });
    });

    it('(GET) - Получить все теги с page=2', async () => {
      return request(app.getHttpServer())
        .get('/tags?page=2')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(0);
        });
    });

    it('(GET) - Получить все теги с limit=1', async () => {
      return request(app.getHttpServer())
        .get('/tags?limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
        });
    });

    it('(GET) - Получить все теги с page=2 и limit=1', async () => {
      return request(app.getHttpServer())
        .get('/tags?page=2&limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
        });
    });

    it(`(GET) - Получить все теги с search=${newTags[0].name}`, async () => {
      return request(app.getHttpServer())
        .get(encodeURI(`/tags?search=${newTags[0].name}`))
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].name).toEqual(newTags[0].name);
        });
    });

    it('(GET) - Получить все популярные теги', async () => {
      return request(app.getHttpServer())
        .get('/tags/popular')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.length).toBe(0);
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

    it('(GET) - Получить тег по slug', async () => {
      return request(app.getHttpServer())
        .get(`/tags/${createdTag.slug}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdTag._id);
        });
    });

    it('(GET/E) - Получить несуществующий тег по slug', async () => {
      return request(app.getHttpServer()).get(`/tags/slug-${clownId}`).expect(404);
    });
  });
});
