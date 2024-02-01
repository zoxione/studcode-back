import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterProjectDto } from '../dto/find-all-filter-project.dto';
import { ProjectDocument } from '../schemas/project.schema';

export type FindAllReturnProject = FindAllReturn<FindAllFilterProjectDto, ProjectDocument> & {};
