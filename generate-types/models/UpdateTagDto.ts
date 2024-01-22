import type { TagNameDto } from "./TagNameDto";

export type UpdateTagDto = {
    /**
     * @description Название
    */
    name: TagNameDto;
    /**
     * @description Ссылка на иконку
     * @type string
    */
    icon: string;
};