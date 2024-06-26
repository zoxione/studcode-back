import type { TagNameDto } from "./TagNameDto";

export type CreateTagDto = {
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