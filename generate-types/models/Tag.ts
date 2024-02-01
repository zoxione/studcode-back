import type { ObjectId } from "./ObjectId";
import type { TagNameDto } from "./TagNameDto";

export type Tag = {
    /**
     * @description Идентификатор
    */
    _id: ObjectId;
    /**
     * @description Название
    */
    name: TagNameDto;
    /**
     * @description Ссылка на иконку
     * @type string
    */
    icon: string;
    /**
     * @description Ключевое слово
     * @type string
    */
    slug: string;
};