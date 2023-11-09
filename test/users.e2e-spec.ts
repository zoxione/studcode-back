import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Users Controller (e2e)', () => {
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

  const newUsers = [
    {
      _id: 'f53528c0460a017f68186916',
      username: 'zoxione',
      email: 'zoxione@gmail.com',
      password: 'password',
      role: 'admin',
      refresh_token: 'token',
      name: {
        last: 'last',
        first: 'first',
        middle: 'middle',
      },
      avatar: 'https://ya.ru/',
      about: '',
      projects: [],
    },
    {
      _id: 'f53528c0460a017f68186917',
      username: '111',
      email: '111@gmail.com',
      password: '111',
    },
  ];

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let refresh_token: string = '';
  let createdUser: User;

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

  describe('Users', () => {
    it('(POST) - Регистрация нового пользователя со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(newUsers[0])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newUsers[0]._id);
          createdUser = res.body;
        });
    });

    it('(POST) - Регистрация нового пользователя с минимальными полями', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(newUsers[1])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newUsers[1]._id);
        });
    });

    it('(GET) - Получить всех пользователей без фильтра', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(newUsers.length + 1);
        });
    });

    it('(GET) - Получить всех пользователей с page=1', async () => {
      return request(app.getHttpServer())
        .get('/users?page=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(0);
        });
    });

    it('(GET) - Получить всех пользователей с limit=1', async () => {
      return request(app.getHttpServer())
        .get('/users?limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
        });
    });

    it('(GET) - Получить всех пользователей с page=1 и limit=1', async () => {
      return request(app.getHttpServer())
        .get('/users?page=1&limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
        });
    });

    it(`(GET) - Получить всех пользователей с search=${newUsers[0].username}`, async () => {
      return request(app.getHttpServer())
        .get(encodeURI(`/users?search=${newUsers[0].username}`))
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.data.length).toBe(1);
          expect(res.body.data[0].username).toEqual(newUsers[0].username);
        });
    });

    it('(GET) - Получить пользователя по ID', async () => {
      return request(app.getHttpServer())
        .get(`/users/${createdUser._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdUser._id);
        });
    });

    it('(GET/E) - Получить несуществующего пользователя по ID', async () => {
      return request(app.getHttpServer()).get(`/users/${clownId}`).expect(404);
    });

    it('(PUT) - Обновить пользователя по ID', async () => {
      const updateUser: Partial<UpdateUserDto> = {
        username: 'new username',
      };
      return request(app.getHttpServer())
        .put(`/users/${createdUser?._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateUser)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.username).toEqual(updateUser.username);
        });
    });

    it('(PUT/E) - Обновить несуществующего пользователя по ID', async () => {
      const updateUser: Partial<UpdateUserDto> = {
        username: 'new username',
      };
      return request(app.getHttpServer())
        .put(`/users/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateUser)
        .expect(404);
    });

    it('(PUT/E) - Обновить пользователя по ID без токена', async () => {
      const updateUser: Partial<UpdateUserDto> = {
        username: 'new username',
      };
      return request(app.getHttpServer())
        .put(`/users/${createdUser?._id}`)
        .send(updateUser)
        .expect(401);
    });

    it('(DELETE) - Удалить пользователя по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${createdUser?._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdUser._id);
        });
    });

    it('(DELETE/E) - Удалить несуществующего пользователя по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/users/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE/E) - Удалить пользователя по ID без токена', async () => {
      return request(app.getHttpServer()).delete(`/users/${newUsers[1]._id}`).expect(401);
    });
  });
});
