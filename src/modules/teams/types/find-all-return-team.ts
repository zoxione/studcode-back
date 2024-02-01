import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterTeamDto } from '../dto/find-all-filter-team.dto';
import { TeamDocument } from '../schemas/team.schema';

export type FindAllReturnTeam = FindAllReturn<FindAllFilterTeamDto, TeamDocument> & {};
