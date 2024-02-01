import type { ObjectId } from "./ObjectId";
import type { Project } from "./Project";
import type { User } from "./User";

export type Review = {
    /**
     * @description Идентификатор
    */
    _id: ObjectId;
    /**
     * @description Текст
     * @type string
    */
    text: string;
    /**
     * @description Оценка
     * @type number
    */
    rating: number;
    /**
     * @description Проект
    */
    project: Project;
    /**
     * @description Рецензент
    */
    reviewer: User;
    /**
     * @description Пользователи, поставившие лайки
     * @type array
    */
    likes: ObjectId[];
    /**
     * @description Пользователи, поставившие дизлайки
     * @type array
    */
    dislikes: ObjectId[];
};