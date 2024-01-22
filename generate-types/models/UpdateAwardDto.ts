import type { AwardNameDto } from "./AwardNameDto";

export type UpdateAwardDto = {
    /**
     * @description Название
    */
    name: AwardNameDto;
    /**
     * @description Ссылка на иконку
     * @type string
    */
    icon: string;
};