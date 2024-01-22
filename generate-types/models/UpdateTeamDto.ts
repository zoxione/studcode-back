export type UpdateTeamDto = {
    /**
     * @description Название
     * @type string
    */
    name: string;
    /**
     * @description О команде
     * @type string
    */
    about: string;
    /**
     * @description Ссылка на логотип
     * @type string
    */
    logo: string;
    /**
     * @description Участники
     * @type array
    */
    users: string[];
    /**
     * @description Проекты
     * @type array
    */
    projects: string[];
};