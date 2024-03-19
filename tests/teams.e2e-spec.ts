import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import configuration from '../src/config/configuration';
import { UpdateTeamDto } from '../src/modules/teams/dto/update-team.dto';
import { Team } from '../src/modules/teams/schemas/team.schema';
import { User } from '../src/modules/users/schemas/user.schema';

describe('Teams Controller (e2e)', () => {
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

  const userMember = {
    _id: 'b53528c0460a017f68186916',
    username: Math.random().toString(36).substring(7),
    email: `${Math.random().toString(36).substring(7)}@example.com`,
    password: Math.random().toString(36).substring(7),
  };

  const newTeams = [
    {
      _id: 'f53528c0460a017f68186916',
      name: 'shinobi',
      about: 'about',
      status: 'opened',
      logo: 'https://sample.com/avatar.png',
      members: [{ user: user._id, role: 'owner' }],
    },
    {
      _id: 'f53528c0460a017f68186917',
      name: 'fnatic',
    },
  ];

  const clownId = '555555555555555555555555';
  let access_token: string = '';
  let access_token_member: string = '';
  let refresh_token: string = '';
  let createdUser: User;
  let createdTeam: Team;

  describe('Auth', () => {
    it('(POST) - Регистрация нового пользователя с ролью member', async () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(userMember)
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.email).toEqual(userMember.email);
        });
    });

    it('(POST) - Аутентификация пользователя с ролью member', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: userMember.email, password: userMember.password })
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          access_token_member = res.body.access_token;
        });
    });

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

  describe('Teams', () => {
    it('(POST) - Создание новой команды со всеми полями', async () => {
      return request(app.getHttpServer())
        .post('/teams')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newTeams[0])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newTeams[0]._id);
          createdTeam = res.body;
        });
    });

    it('(POST) - Создание новой команды с минимальными полями', async () => {
      return request(app.getHttpServer())
        .post('/teams')
        .set('Authorization', 'Bearer ' + access_token)
        .send(newTeams[1])
        .expect(201)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(newTeams[1]._id);
        });
    });

    it('(POST/E) - Создание новой команды без токена', async () => {
      return request(app.getHttpServer()).post('/teams').set('Authorization', 'Bearer ').send(newTeams[1]).expect(401);
    });

    it('(GET) - Получить все команды без фильтра', async () => {
      return request(app.getHttpServer())
        .get('/teams')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(newTeams.length);
        });
    });

    it('(GET) - Получить все команды с page=2', async () => {
      return request(app.getHttpServer())
        .get('/teams?page=2')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(0);
        });
    });

    it('(GET) - Получить все команды с limit=1', async () => {
      return request(app.getHttpServer())
        .get('/teams?limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
        });
    });

    it('(GET) - Получить все команды с page=2 и limit=1', async () => {
      return request(app.getHttpServer())
        .get('/teams?page=2&limit=1')
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
        });
    });

    it(`(GET) - Получить все команды с search=${newTeams[0].name}`, async () => {
      return request(app.getHttpServer())
        .get(encodeURI(`/teams?search=${newTeams[0].name}`))
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.results.length).toBe(1);
          expect(res.body.results[0].name).toEqual(newTeams[0].name);
        });
    });

    it('(GET) - Получить команду по ID', async () => {
      return request(app.getHttpServer())
        .get(`/teams/${createdTeam._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdTeam._id);
        });
    });

    it('(GET/E) - Получить несуществующею команду по ID', async () => {
      return request(app.getHttpServer()).get(`/teams/${clownId}`).expect(404);
    });

    it('(GET) - Получить команду по name', async () => {
      return request(app.getHttpServer())
        .get(`/teams/${createdTeam.name}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdTeam._id);
        });
    });

    it('(GET/E) - Получить несуществующею команду по name', async () => {
      return request(app.getHttpServer()).get(`/teams/name-${clownId}`).expect(404);
    });

    it('(PUT) - Обновить команду по ID', async () => {
      const updateTeam: Partial<UpdateTeamDto> = {
        name: 'Update Team',
      };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateTeam)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.name).toEqual(updateTeam.name);
        });
    });

    it('(PUT/E) - Обновить несуществующею команду по ID', async () => {
      const updateTeam: Partial<UpdateTeamDto> = {
        name: 'Update Team',
      };
      return request(app.getHttpServer())
        .put(`/teams/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateTeam)
        .expect(404);
    });

    it('(PUT/E) - Обновить команду по ID без токена', async () => {
      const updateTeam: Partial<UpdateTeamDto> = {
        name: 'Update Team',
      };
      return request(app.getHttpServer()).put(`/teams/${createdTeam._id}`).set('Authorization', 'Bearer ').send(updateTeam).expect(401);
    });

    it('(POST) - Добавить участника в команду по ID', async () => {
      const updateMembers = { members: [{ member: { user: userMember._id, role: 'member' }, action: 'add' }] };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}/members`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateMembers)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.members.length).toEqual(2);
          expect(res.body.members[1].user._id).toEqual(updateMembers.members[0].member.user);
        });
    });

    it('(POST/E) - Повторное добавление участника в команду по ID', async () => {
      const updateMembers = { members: [{ member: { user: userMember._id, role: 'member' }, action: 'add' }] };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}/members`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateMembers)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.members.length).toEqual(2);
        });
    });

    it('(POST/E) - Добавить участника в команду по ID без токена', async () => {
      const updateMembers = { members: [{ member: { user: userMember._id, role: 'member' }, action: 'add' }] };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}/members`)
        .set('Authorization', 'Bearer ')
        .send(updateMembers)
        .expect(401);
    });

    it('(POST/E) - Добавить участника в команду по ID с ролью member', async () => {
      const updateMembers = { members: [{ member: { user: userMember._id, role: 'member' }, action: 'add' }] };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}/members`)
        .set('Authorization', 'Bearer ' + access_token_member)
        .send(updateMembers)
        .expect(401);
    });

    it('(POST) - Удалить участника из команды по ID', async () => {
      const updateMembers = { members: [{ member: { user: userMember._id, role: 'member' }, action: 'remove' }] };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}/members`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateMembers)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.members.length).toEqual(1);
        });
    });

    it('(POST/E) - Повторное удаление участника из команды по ID', async () => {
      const updateMembers = { members: [{ member: { user: userMember._id, role: 'member' }, action: 'remove' }] };
      return request(app.getHttpServer())
        .put(`/teams/${createdTeam._id}/members`)
        .set('Authorization', 'Bearer ' + access_token)
        .send(updateMembers)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.members.length).toEqual(1);
        });
    });

    it('(DELETE) - Удалить команду по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/teams/${createdTeam._id}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(createdTeam._id);
        });
    });

    it('(DELETE/E) - Удалить несуществующею команду по ID', async () => {
      return request(app.getHttpServer())
        .delete(`/teams/${clownId}`)
        .set('Authorization', 'Bearer ' + access_token)
        .expect(404);
    });

    it('(DELETE/E) - Удалить команду по ID без токена', async () => {
      return request(app.getHttpServer()).delete(`/teams/${newTeams[1]._id}`).set('Authorization', 'Bearer ').expect(401);
    });
  });
});
