import type { ProjectLinksDto } from "./ProjectLinksDto";

export const UpdateProjectDtoStatus = {
    "draft": "draft",
    "published": "published",
    "archived": "archived"
} as const;
export type UpdateProjectDtoStatus = (typeof UpdateProjectDtoStatus)[keyof typeof UpdateProjectDtoStatus];
export const UpdateProjectDtoPrice = {
    "free": "free",
    "free_options": "free_options",
    "payment_required": "payment_required"
} as const;
export type UpdateProjectDtoPrice = (typeof UpdateProjectDtoPrice)[keyof typeof UpdateProjectDtoPrice];
export type UpdateProjectDto = {
    /**
     * @description Название
     * @type string
    */
    title: string;
    /**
     * @description Слоган
     * @type string
    */
    tagline: string;
    /**
     * @description Статус
     * @type string
    */
    status: UpdateProjectDtoStatus;
    /**
     * @description Описание
     * @type string
    */
    description: string;
    /**
     * @description Количество огоньков
     * @type number
    */
    flames: number;
    /**
     * @description Ссылки
    */
    links: ProjectLinksDto;
    /**
     * @description Ссылка на логотип
     * @type string
    */
    logo: string;
    /**
     * @description Массив скриншотов
     * @type array
    */
    screenshots: string[];
    /**
     * @description Цена
     * @type string
    */
    price: UpdateProjectDtoPrice;
    /**
     * @description Теги
     * @type array
    */
    tags: string[];
    /**
     * @description Создатель
     * @type string
    */
    creator: string;
};