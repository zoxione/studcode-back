import { Project } from '../schemas/project.schema';

export type ReturnProject = Project & {
  voted?: boolean;
};
