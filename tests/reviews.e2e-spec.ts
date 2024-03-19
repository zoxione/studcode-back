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
      text: 'крутяк',
      rating: 5,
      likes: 0,
      dislikes: 0,
      project: newProjects[0]._id,
      reviewer: user._id,
    },
    {
      _id: 'f53528c0460a017f68186917',
      text: 'хуяк',
      project: newProjects[1]._id,
      reviewer: user._id,
    },
  ];

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let refresh_token: string = '';
  let createdUser: User;
  let createdReview: Review;

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

  describe('Projects', () => {
    it('(POST) - Создание нового проекта 1', async () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newProjects[0])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newProjects[0]._id);
        });
    });

    it('(POST) - Создание нового проекта 2', async () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newProjects[1])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newProjects[1]._id);
        });
    });
  });

  describe('Reviews', () => {
    it('(POST) - Создание нового обзора со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/reviews')
        .set('Authorization', 'Bearer ' + access_token)
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
        .set('Authorization', 'Bearer ' + access_token)
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
        .set('Authorization', 'Bearer ' + access_token)
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
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateReview)
        .expect(404);
    });

    it('(PUT/E) - Обновить обзор по ID без токена', async () => {
      const updateReview: Partial<UpdateReviewDto> = {
        text: 'Update Review',
      };
      return request(app.getHttpServer())
        .put(`/reviews/${createdReview._id}`)
        .set('Authorization', 'Bearer ')
        .send(updateReview)
        .expect(401);
    });

    it('(POST) - Поставить лайк обзору по ID', async () => {
      return request(app.getHttpServer())
        .post(`/reviews/${newReviews[0]._id}/like`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.likes).toEqual((newReviews[0].likes as number) + 1);
        });
    });

    it('(POST/E) - Повторно поставить лайк обзору по ID', async () => {
      return request(app.getHttpServer())
        .post(`/reviews/${newReviews[0]._id}/like`)
        .set('Authorization', 'Bearer ' + access_token)
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
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(POST) - Поставить дизлайк обзору по ID', async () => {
      return request(app.getHttpServer())
        .post(`/reviews/${newReviews[0]._id}/dislike`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.dislikes).toEqual((newReviews[0].dislikes as number) + 1);
        });
    });

    it('(POST/E) - Повторно поставить дизлайк обзору по ID', async () => {
      return request(app.getHttpServer())
        .post(`/reviews/${newReviews[0]._id}/dislike`)
        .set('Authorization', 'Bearer ' + access_token)
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
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE) - Удалить обзор по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/reviews/${createdReview._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdReview._id);
        });
    });

    it('(DELETE/E) - Удалить несуществующий обзор по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/reviews/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE/E) - Удалить обзор по ID без токена', async () => {
      return request(app.getHttpServer()).delete(`/reviews/${newReviews[1]._id}`).set('Authorization', 'Bearer ').expect(401);
    });
  });
});
