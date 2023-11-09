export const mockProject = {
  _id: 'f53528c0460a017f68186916',
  title: 'Project One',
  description: 'Description',
  flames: 0,
  link: 'https://ya.ru/',
  avatar: 'https://ya.ru/',
  screenshots: [],
  tags: [],
};

export const ProjectsServiceValue = {
  createOne: jest.fn().mockResolvedValue(mockProject),
  findAll: jest.fn().mockResolvedValue([mockProject]),
  findOne: jest.fn().mockResolvedValue(mockProject),
  updateOne: jest.fn().mockResolvedValue(mockProject),
  deleteOne: jest.fn().mockResolvedValue(mockProject),
};
