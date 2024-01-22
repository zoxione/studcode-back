import type { UserFullNameDto } from "./UserFullNameDto";
import type { UserLinksDto } from "./UserLinksDto";
import type { Award } from "./Award";
import type { Project } from "./Project";

export const CreateUserDtoRole = {
    "user": "user",
    "admin": "admin"
} as const;
export type CreateUserDtoRole = (typeof CreateUserDtoRole)[keyof typeof CreateUserDtoRole];
export type CreateUserDto = {
    /**
     * @description Имя пользователя
     * @type string
    */
    username: string;
    /**
     * @description Электронная почта
     * @type string
    */
    email: string;
    /**
     * @description Пароль
     * @type string
    */
    password: string;
    /**
     * @description Роль
     * @type string
    */
    role: CreateUserDtoRole;
    /**
     * @description Токен обновления
     * @type string
    */
    refresh_token: string;
    /**
     * @description ФИО
    */
    full_name: UserFullNameDto;
    /**
     * @description Ссылка на аватар
     * @type string
    */
    avatar: string;
    /**
     * @description О себе
     * @type string
    */
    about: string;
    /**
     * @description Ссылки
    */
    links: UserLinksDto;
    /**
     * @description Награды
     * @type array
    */
    awards: Award[];
    /**
     * @description Проекты
     * @type array
    */
    projects: Project[];
};