import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { User } from '../src/modules/users/schemas/user.schema';
import { UpdateReviewDto } from '../src/modules/reviews/dto/update-review.dto';
import { Review } from '../src/modules/reviews/schemas/review.schema';

describe('Reviews Controller (e2e)', () => {
  let app: INestApplication;
  const clownId = '555555555555555555555555';
  let accessToken: string = '';
  let refreshToken: string = '';
  let createdAdmin: User;
  let createdReview: Review;
  const admin = {
    _id: 'f53528c0460a017f68186911',
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    role: 'admin',
    password: Math.random().toString(36).substring(7),
  };
  const newProjects = [
    {
      _id: 'f53528c0460a017f68186916',
      title: 'One',
    },
    {
      _id: 'f53528c0460a017f68186917',
      title: 'Two',
    },
  ];
  const newReviews = [
    {
      _id: 'f53528c0460a017f68186916',
      text: 'круто',
      rating: 5,
      likes: 0,
      dislikes: 0,
      project: newProjects[0]._id,
      reviewer: admin._id,
    },
    {
      _id: 'f53528c0460a017f68186917',
      text: 'некруто',
      project: newProjects[1]._id,
      reviewer: admin._id,
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

    // Создание нового проекта 1
    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newProjects[0])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newProjects[0]._id);
      });

    // Создание нового проекта 2'
    await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newProjects[1])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newProjects[1]._id);
      });
  });

  afterAll(() => {
    mongoose.disconnect();
  });

  it('(POST) - Создание нового обзора со всеми полями', async () => {
    return request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newReviews[0])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newReviews[0]._id);
        createdReview = res.body;
      });
  });

  it('(POST) - Создание нового обзора с минимальными полями', async () => {
    return request(app.getHttpServer())
      .post('/reviews')
      .set('Authorization', 'Bearer ' + accessToken)
      .send(newReviews[1])
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(newReviews[1]._id);
      });
  });

  it('(POST/E) - Создание нового обзора без токена', async () => {
    return request(app.getHttpServer()).post('/reviews').set('Authorization', 'Bearer ').send(newReviews[1]).expect(401);
  });

  it('(GET) - Получить все обзоры без фильтра', async () => {
    return request(app.getHttpServer())
      .get('/reviews')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(newReviews.length);
      });
  });

  it('(GET) - Получить все обзоры с page=2', async () => {
    return request(app.getHttpServer())
      .get('/reviews?page=2')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(0);
      });
  });

  it('(GET) - Получить все обзоры с limit=1', async () => {
    return request(app.getHttpServer())
      .get('/reviews?limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it('(GET) - Получить все обзоры с page=2 и limit=1', async () => {
    return request(app.getHttpServer())
      .get('/reviews?page=2&limit=1')
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
      });
  });

  it(`(GET) - Получить все обзоры с search=${newReviews[0].text}`, async () => {
    return request(app.getHttpServer())
      .get(encodeURI(`/reviews?search=${newReviews[0].text}`))
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.results.length).toBe(1);
        expect(res.body.results[0].text).toEqual(newReviews[0].text);
      });
  });

  it('(GET) - Получить обзор по ID', async () => {
    return request(app.getHttpServer())
      .get(`/reviews/${createdReview._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(createdReview._id);
      });
  });

  it('(GET/E) - Получить несуществующий обзор по ID', async () => {
    return request(app.getHttpServer()).get(`/reviews/${clownId}`).expect(404);
  });

  it('(PUT) - Обновить обзор по ID', async () => {
    const updateReview: Partial<UpdateReviewDto> = {
      text: 'Update Review',
    };
    return request(app.getHttpServer())
      .put(`/reviews/${createdReview._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateReview)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.text).toEqual(updateReview.text);
      });
  });

  it('(PUT/E) - Обновить несуществующий обзор по ID', async () => {
    const updateReview: Partial<UpdateReviewDto> = {
      text: 'Update Review',
    };
    return request(app.getHttpServer())
      .put(`/reviews/${clownId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .send(updateReview)
      .expect(404);
  });

  it('(PUT/E) - Обновить обзор по ID без токена', async () => {
    const updateReview: Partial<UpdateReviewDto> = {
      text: 'Update Review',
    };
    return request(app.getHttpServer()).put(`/reviews/${createdReview._id}`).set('Authorization', 'Bearer ').send(updateReview).expect(401);
  });

  it('(POST) - Поставить лайк обзору по ID', async () => {
    return request(app.getHttpServer())
      .post(`/reviews/${newReviews[0]._id}/like`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.likes).toEqual((newReviews[0].likes as number) + 1);
      });
  });

  it('(POST/E) - Повторно поставить лайк обзору по ID', async () => {
    return request(app.getHttpServer())
      .post(`/reviews/${newReviews[0]._id}/like`)
      .set('Authorization', 'Bearer ' + accessToken)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.likes).toEqual(newReviews[0].likes as number);
      });
  });

  it('(POST/E) - Поставить лайк обзору без токена по ID', async () => {
    return request(app.getHttpServer()).post(`/reviews/${newReviews[0]._id}/like`).set('Authorization', 'Bearer ').expect(401);
  });

  it('(POST/E) - Поставить лайк несуществующему обзору по ID', async () => {
    return request(app.getHttpServer())
      .post(`/reviews/${clownId}/like`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404);
  });

  it('(POST) - Поставить дизлайк обзору по ID', async () => {
    return request(app.getHttpServer())
      .post(`/reviews/${newReviews[0]._id}/dislike`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(201)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.dislikes).toEqual((newReviews[0].dislikes as number) + 1);
      });
  });

  it('(POST/E) - Повторно поставить дизлайк обзору по ID', async () => {
    return request(app.getHttpServer())
      .post(`/reviews/${newReviews[0]._id}/dislike`)
      .set('Authorization', 'Bearer ' + accessToken)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.dislikes).toEqual(newReviews[0].dislikes as number);
      });
  });

  it('(POST/E) - Поставить дизлайк обзору без токена по ID', async () => {
    return request(app.getHttpServer()).post(`/reviews/${newReviews[0]._id}/dislike`).set('Authorization', 'Bearer ').expect(401);
  });

  it('(POST/E) - Поставить дизлайк несуществующему обзору по ID', async () => {
    return request(app.getHttpServer())
      .post(`/reviews/${clownId}/dislike`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404);
  });

  it('(DELETE) - Удалить обзор по ID', async () => {
    return request(app.getHttpServer())
      .delete(`/reviews/${createdReview._id}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(createdReview._id);
      });
  });

  it('(DELETE/E) - Удалить несуществующий обзор по ID', async () => {
    return request(app.getHttpServer())
      .delete(`/reviews/${clownId}`)
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(404);
  });

  it('(DELETE/E) - Удалить обзор по ID без токена', async () => {
    return request(app.getHttpServer()).delete(`/reviews/${newReviews[1]._id}`).set('Authorization', 'Bearer ').expect(401);
  });
});
