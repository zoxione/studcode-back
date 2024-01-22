import type { ObjectId } from "./ObjectId";
import type { User } from "./User";
import type { Project } from "./Project";

export type Team = {
    /**
     * @description Идентификатор
    */
    _id: ObjectId;
    /**
     * @description Название
     * @type string
    */
    name: string;
    /**
     * @description О команде
     * @type string
    */
    about: string;
    /**
     * @description Ссылка на логотип
     * @type string
    */
    logo: string;
    /**
     * @description Участники
     * @type array
    */
    users: User[];
    /**
     * @description Проекты
     * @type array
    */
    projects: Project[];
};