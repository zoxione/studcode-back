import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterProjectDto } from '../dto/find-all-filter-project.dto';
import { ReturnProject } from './return-project';

export type FindAllReturnProject = FindAllReturn<FindAllFilterProjectDto, ReturnProject> & {};
