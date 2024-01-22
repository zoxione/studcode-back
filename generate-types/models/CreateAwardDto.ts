import type { AwardNameDto } from "./AwardNameDto";

export type CreateAwardDto = {
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