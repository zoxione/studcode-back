export type CreateVoteDto = {
    /**
     * @description Проект
     * @type string
    */
    project: string;
    /**
     * @description Голосующий
     * @type string
    */
    voter: string;
};