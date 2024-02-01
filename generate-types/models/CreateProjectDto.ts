import type { ProjectLinksDto } from "./ProjectLinksDto";

export const CreateProjectDtoStatus = {
    "draft": "draft",
    "published": "published",
    "archived": "archived"
} as const;
export type CreateProjectDtoStatus = (typeof CreateProjectDtoStatus)[keyof typeof CreateProjectDtoStatus];
export const CreateProjectDtoPrice = {
    "free": "free",
    "free_options": "free_options",
    "payment_required": "payment_required"
} as const;
export type CreateProjectDtoPrice = (typeof CreateProjectDtoPrice)[keyof typeof CreateProjectDtoPrice];
export type CreateProjectDto = {
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
    status: CreateProjectDtoStatus;
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
    price: CreateProjectDtoPrice;
    /**
     * @description Рейтинг
     * @type number
    */
    rating: number;
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