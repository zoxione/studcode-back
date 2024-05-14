import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { UpdateUserDto } from '../src/modules/users/dto/update-user.dto';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;
  const clownId = '555555555555555555555555';
  let accessToken: string = '';
  let refreshToken: string = '';
  let createdAdmin: User;
  const admin = {
    _id: 'f53528c0460a017f68186911',
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    role: 'admin',
    password: Math.random().toString(36).substring(7),
  };
  const newUsers = [
    {
      _id: 'f53528c0460a017f68186916',
      username: 'zoxione',
      email: 'zoxione@gmail.com',
      password: 'password',
      role: 'admin',
      verify_email: 'false',
      refreshToken: 'token',
      full_name: {
        surname: 'surname',
        name: 'name',
        patronymic: 'patronymic',
      },
      avatar: 'https://sample.com/avatar.png',
      about: 'about',
      link: [],
    },
    {
      _id: 'f53528c0460a017f68186917',
      username: '111',
      email: '111@gmail.com',
      password: '111',
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

  it('(POST) - Регистрация нового пользователя со всеми полями', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(newUsers[0])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newUsers[0]._id);
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
        expect(res.body.results.length).toBe(newUsers.length + 1);
      });
  });

  it('(GET) - Получить всех пользователей с page=2', async () => {
    return request(app.getHttpServer())
      .get('/users?page=2')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(0);
      });
  });

  it('(GET) - Получить всех пользователей с limit=1', async () => {
    return request(app.getHttpServer())
      .get('/users?limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it('(GET) - Получить всех пользователей с page=2 и limit=1', async () => {
    return request(app.getHttpServer())
      .get('/users?page=2&limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it(`(GET) - Получить всех пользователей с search=${newUsers[0].username}`, async () => {
    return request(app.getHttpServer())
      .get(encodeURI(`/users?search=${newUsers[0].username}`))
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].username).toEqual(newUsers[0].username);
      });
  });

  it('(GET) - Получить пользователя по ID', async () => {
    return request(app.getHttpServer())
      .get(`/users/${newUsers[0]._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newUsers[0]._id);
      });
  });

  it('(GET/E) - Получить несуществующего пользователя по ID', async () => {
    return request(app.getHttpServer()).get(`/users/${clownId}`).expect(404);
  });

  it('(GET) - Получить пользователя по username', async () => {
    return request(app.getHttpServer())
      .get(`/users/${newUsers[0].username}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newUsers[0]._id);
      });
  });

  it('(GET/E) - Получить несуществующего пользователя по username', async () => {
    return request(app.getHttpServer()).get(`/users/clown`).expect(404);
  });

  it('(GET) - Получить пользователя по email', async () => {
    return request(app.getHttpServer())
      .get(`/users/${newUsers[0].email}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newUsers[0]._id);
      });
  });

  it('(GET/E) - Получить несуществующего пользователя по email', async () => {
    return request(app.getHttpServer()).get(`/users/clown@example.com`).expect(404);
  });

  it('(PUT) - Обновить пользователя по ID', async () => {
    const updateAdmin: Partial<UpdateUserDto> = {
      username: 'new username',
    };
    return request(app.getHttpServer())
      .put(`/users/${admin._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateAdmin)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.username).toEqual(updateAdmin.username);
      });
  });

  it('(PUT/E) - Обновить несуществующего пользователя по ID', async () => {
    const updateAdmin: Partial<UpdateUserDto> = {
      username: 'new username',
    };
    return request(app.getHttpServer())
      .put(`/users/${clownId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateAdmin)
      .expect(404);
  });

  it('(PUT/E) - Обновить пользователя по ID без токена', async () => {
    const updateAdmin: Partial<UpdateUserDto> = {
      username: 'new username',
    };
    return request(app.getHttpServer()).put(`/users/${admin._id}`).set('Authorization', 'Bearer ').send(updateAdmin).expect(401);
  });
});
