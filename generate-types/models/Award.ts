import type { ObjectId } from "./ObjectId";
import type { AwardNameDto } from "./AwardNameDto";

export type Award = {
    /**
     * @description Идентификатор
    */
    _id: ObjectId;
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