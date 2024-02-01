import { FindAllReturn } from '../../../common/types/find-all-return';
import { FindAllFilterUserDto } from '../dto/find-all-filter-user.dto';
import { UserDocument } from '../schemas/user.schema';

export type FindAllReturnUser = FindAllReturn<FindAllFilterUserDto, UserDocument> & {};
