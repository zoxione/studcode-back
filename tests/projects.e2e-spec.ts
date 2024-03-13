import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { UpdateProjectDto } from '../src/modules/projects/dto/update-project.dto';
import { Project } from '../src/modules/projects/schemas/project.schema';
import { User } from '../src/modules/users/schemas/user.schema';
import { startOfToday, subYears } from 'date-fns';
import { getRandomId } from '../src/utils/get-random-id';

describe('Projects Controller (e2e)', () => {
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
    _id: getRandomId(),
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    password: Math.random().toString(36).substring(7),
  };

  const newProjects = [
    {
      _id: 'f53528c0460a017f68186916',
      title: 'One',
      tagline: 'Tagline',
      status: 'draft',
      type: 'other',
      description: 'Description',
      flames: 0,
      logo: 'https://sample.com/avatar.png',
      screenshots: [
        'https://sample.com/screenshot_1.png',
        'https://sample.com/screenshot_2.png',
        'https://sample.com/screenshot_3.png',
        'https://sample.com/screenshot_4.png',
        'https://sample.com/screenshot_5.png',
      ],
      price: 'free',
      ration: 4,
      creator: user._id,
      tags: [],
      links: [{ type: 'github', label: 'Github', url: 'https://github.com' }],
      created_at: subYears(startOfToday(), 1),
      updated_at: subYears(startOfToday(), 1),
    },
    {
      _id: 'f53528c0460a017f68186917',
      title: 'Two',
    },
  ];

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let refresh_token: string = '';
  let createdUser: User;
  let createdProject: Project;

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
    it('(POST) - Создание нового проекта со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newProjects[0])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newProjects[0]._id);
          createdProject = res.body;
        });
    });

    it('(POST) - Создание нового проекта с минимальными полями', async () => {
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

    it('(POST/E) - Создание нового проекта без токена', async () => {
      return request(app.getHttpServer())
        .post('/projects')
        .set('Authorization', 'Bearer ')
        .send(newProjects[1])
        .expect(401);
    });

    it('(GET) - Получить все проекты без фильтра', async () => {
      return request(app.getHttpServer())
        .get('/projects')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newProjects.length);
        });
    });

    it('(GET) - Получить все проекты с page=2', async () => {
      return request(app.getHttpServer())
        .get('/projects?page=2')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(0);
        });
    });

    it('(GET) - Получить все проекты с limit=1', async () => {
      return request(app.getHttpServer())
        .get('/projects?limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
        });
    });

    it('(GET) - Получить все проекты с page=2 и limit=1', async () => {
      return request(app.getHttpServer())
        .get('/projects?page=2&limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
        });
    });

    it(`(GET) - Получить все проекты с search=${newProjects[0].title}`, async () => {
      return request(app.getHttpServer())
        .get(`/projects?search=${newProjects[0].title}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].title).toEqual(newProjects[0].title);
        });
    });

    it(`(GET) - Получить все проекты с time_frame=week`, async () => {
      return request(app.getHttpServer())
        .get(`/projects?time_frame=week`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newProjects.length - 1);
        });
    });

    it(`(GET) - Получить все проекты с time_frame=month`, async () => {
      return request(app.getHttpServer())
        .get(`/projects?time_frame=month`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newProjects.length - 1);
        });
    });

    it(`(GET) - Получить все проекты с time_frame=year`, async () => {
      return request(app.getHttpServer())
        .get(`/projects?time_frame=year`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newProjects.length);
        });
    });

    it(`(GET) - Получить все проекты с time_frame=all`, async () => {
      return request(app.getHttpServer())
        .get(`/projects?time_frame=all`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newProjects.length);
        });
    });

    it('(GET) - Получить проект по ID', async () => {
      return request(app.getHttpServer())
        .get(`/projects/${createdProject._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdProject._id);
        });
    });

    it('(GET/E) - Получить несуществующий проект по ID', async () => {
      return request(app.getHttpServer()).get(`/projects/${clownId}`).expect(404);
    });

    it('(GET) - Получить проект по slug', async () => {
      return request(app.getHttpServer())
        .get(`/projects/${createdProject.slug}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdProject._id);
        });
    });

    it('(GET/E) - Получить несуществующий проект по slug', async () => {
      return request(app.getHttpServer()).get(`/projects/slug-${clownId}`).expect(404);
    });

    it('(PUT) - Обновить проект по ID', async () => {
      const updateProject: Partial<UpdateProjectDto> = { title: 'Updated title' };
      return request(app.getHttpServer())
        .put(`/projects/${createdProject._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateProject)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(updateProject.title);
        });
    });

    it('(PUT/E) - Обновить несуществующий проект по ID', async () => {
      const updateProject: Partial<UpdateProjectDto> = { title: 'Updated title' };
      return request(app.getHttpServer())
        .put(`/projects/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateProject)
        .expect(404);
    });

    it('(PUT/E) - Обновить проект по ID без токена', async () => {
      const updateProject: Partial<UpdateProjectDto> = { title: 'Updated title' };
      return request(app.getHttpServer())
        .put(`/projects/${createdProject._id}`)
        .set('Authorization', 'Bearer ')
        .send(updateProject)
        .expect(401);
    });

    it('(POST) - Голосование за проект', async () => {
      return request(app.getHttpServer())
        .post(`/projects/${createdProject._id}/vote`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.flames).toEqual(createdProject.flames + 1);
        });
    });

    it('(POST) - Повторное голосование за проект', async () => {
      return request(app.getHttpServer())
        .post(`/projects/${createdProject._id}/vote`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.flames).toEqual(createdProject.flames);
        });
    });

    it('(POST/E) - Голосование за несуществующий проект', async () => {
      return request(app.getHttpServer())
        .post(`/projects/${clownId}/vote`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(POST/E) - Голосование за проект без токена', async () => {
      return request(app.getHttpServer())
        .post(`/projects/${createdProject._id}/vote`)
        .set('Authorization', 'Bearer ')
        .expect(401);
    });

    it('(DELETE) - Удалить проект по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/projects/${createdProject._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdProject._id);
        });
    });

    it('(DELETE/E) - Удалить несуществующий проект по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/projects/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE/E) - Удалить проект по ID без токена', async () => {
      return request(app.getHttpServer())
        .delete(`/projects/${newProjects[1]._id}`)
        .set('Authorization', 'Bearer ')
        .expect(401);
    });
  });
});
