import type { ObjectId } from "./ObjectId";
import type { Project } from "./Project";
import type { User } from "./User";

export type Vote = {
    /**
     * @description Идентификатор
    */
    _id: ObjectId;
    /**
     * @description Проект
    */
    project: Project;
    /**
     * @description Голосующий
    */
    voter: User;
};