// import { Test, TestingModule } from '@nestjs/testing';
// import { ProjectsController } from '../projects.controller';
// import { ProjectsService } from '../projects.service';
// import { ProjectsServiceValue, mockProject } from './__mocks__/projects.service';
// import { Project } from '../schemas/project.schema';
// import { CreateProjectDto } from '../dto/create-project.dto';
// import { FindAllReturnDto } from '../../../common/dto/find-all-return.dto';
// import { UpdateProjectDto } from '../dto/update-project.dto';
// import { NotFoundException } from '@nestjs/common';

// describe('Projects Controller', () => {
//   let controller: ProjectsController;
//   let service: ProjectsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [],
//       controllers: [ProjectsController],
//       providers: [
//         {
//           provide: ProjectsService,
//           useValue: ProjectsServiceValue,
//         },
//       ],
//     }).compile();

//     controller = module.get<ProjectsController>(ProjectsController);
//     service = module.get<ProjectsService>(ProjectsService);
//     jest.clearAllMocks();
//   });

//   describe('createOne()', () => {
//     describe('когда вызывается createOne()', () => {
//       let project: Project;
//       let createdProjectDto: CreateProjectDto;

//       beforeEach(async () => {
//         createdProjectDto = {
//           ...mockProject,
//         };
//         project = await controller.createOne(createdProjectDto);
//       });

//       test('то он должен вызвать createOne() из ProjectsService', async () => {
//         expect(service.createOne).toBeCalledWith(createdProjectDto);
//       });

//       test('и вернуть проект', () => {
//         expect(project).toEqual(mockProject);
//       });
//     });
//   });

//   describe('findAll()', () => {
//     describe('когда вызывается findAll()', () => {
//       let projects: FindAllReturnDto;

//       beforeEach(async () => {
//         projects = await controller.findAll({});
//       });

//       test('то он должен вызвать findAll() из ProjectsService', async () => {
//         expect(service.findAll).toBeCalledWith({});
//       });

//       test('и вернуть проекты', () => {
//         expect(projects).toEqual([mockProject]);
//       });
//     });
//   });

//   describe('findOneById()', () => {
//     describe('когда вызывается findOneById()', () => {
//       let project: Project;

//       beforeEach(async () => {
//         project = await controller.findOneById(mockProject._id);
//       });

//       test('то он должен вызвать findOne() из ProjectsService', async () => {
//         expect(service.findOne).toBeCalledWith('_id', mockProject._id);
//       });

//       test('и вернуть проект', () => {
//         expect(project).toEqual(mockProject);
//       });
//     });

//     describe('когда вызывается findOneById() по несуществующему id', () => {
//       const nonExistentId = 'nonexistentid';

//       beforeEach(async () => {
//         jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException('Project Not Found'));
//       });

//       test('то он должен вызвать findOne() из ProjectsService', async () => {
//         try {
//           await controller.findOneById(nonExistentId);
//         } catch (error) {
//           expect(service.findOne).toBeCalledWith('_id', nonExistentId);
//         }
//       });

//       test('и выбросить NotFoundException', async () => {
//         await expect(controller.findOneById(nonExistentId)).rejects.toThrow(NotFoundException);
//       });
//     });
//   });

//   describe('updateOneById()', () => {
//     describe('когда вызывается updateOneById()', () => {
//       let project: Project;
//       let updatedProjectDto: UpdateProjectDto;

//       beforeEach(async () => {
//         updatedProjectDto = {
//           ...mockProject,
//           flames: 228,
//         };
//         project = await controller.updateOneById(mockProject._id, updatedProjectDto);
//       });

//       test('то он должен вызвать updateOne() из ProjectsService', async () => {
//         expect(service.updateOne).toBeCalledWith('_id', mockProject._id, updatedProjectDto);
//       });

//       test('и вернуть проект', () => {
//         expect(project).toEqual(mockProject);
//       });
//     });

//     describe('когда вызывается updateOneById() по несуществующему id', () => {
//       const nonExistentId = 'nonexistentid';

//       beforeEach(async () => {
//         jest.spyOn(service, 'updateOne').mockRejectedValue(new NotFoundException('Project Not Updated'));
//       });

//       test('то он должен вызвать updateOne() из ProjectsService', async () => {
//         try {
//           await controller.updateOneById(nonExistentId, mockProject);
//         } catch (error) {
//           expect(service.updateOne).toBeCalledWith('_id', nonExistentId, mockProject);
//         }
//       });

//       test('и выбросить NotFoundException', async () => {
//         await expect(controller.updateOneById(nonExistentId, mockProject)).rejects.toThrow(NotFoundException);
//       });
//     });
//   });

//   describe('delete()', () => {
//     describe('когда вызывается delete()', () => {
//       let project: Project;
//       let createdProjectDto: CreateProjectDto;

//       beforeEach(async () => {
//         createdProjectDto = {
//           ...mockProject,
//         };
//         project = await controller.createOne(createdProjectDto);
//         project = await controller.deleteOneById(mockProject._id);
//       });

//       test('то он должен вызвать deleteOne() из ProjectsService', async () => {
//         expect(service.deleteOne).toBeCalledWith('_id', mockProject._id);
//       });

//       test('и вернуть проект', () => {
//         expect(project).toEqual(mockProject);
//       });
//     });

//     describe('когда вызывается delete() по несуществующему id', () => {
//       const nonExistentId = 'nonexistentid';

//       beforeEach(async () => {
//         jest.spyOn(service, 'deleteOne').mockRejectedValue(new NotFoundException('Project Not Deleted'));
//       });

//       test('то он должен вызвать deleteOne() из ProjectsService', async () => {
//         try {
//           await controller.deleteOneById(nonExistentId);
//         } catch (error) {
//           expect(service.deleteOne).toBeCalledWith('_id', nonExistentId);
//         }
//       });

//       test('и выбросить NotFoundException', async () => {
//         await expect(controller.deleteOneById(nonExistentId)).rejects.toThrow(NotFoundException);
//       });
//     });
//   });
// });
