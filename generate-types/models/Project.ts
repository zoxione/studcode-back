import type { ObjectId } from "./ObjectId";
import type { ProjectLinksDto } from "./ProjectLinksDto";
import type { Tag } from "./Tag";
import type { User } from "./User";

export const ProjectStatus = {
    "draft": "draft",
    "published": "published",
    "archived": "archived"
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];
export const ProjectPrice = {
    "free": "free",
    "free_options": "free_options",
    "payment_required": "payment_required"
} as const;
export type ProjectPrice = (typeof ProjectPrice)[keyof typeof ProjectPrice];
export type Project = {
    /**
     * @description Идентификатор
    */
    _id: ObjectId;
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
    status: ProjectStatus;
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
    price: ProjectPrice;
    /**
     * @description Теги
     * @type array
    */
    tags: Tag[];
    /**
     * @description Создатель
    */
    creator: User;
};