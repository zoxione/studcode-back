export type CreateReviewDto = {
    /**
     * @description Текст
     * @type string
    */
    text: string;
    /**
     * @description Текст
     * @type number
    */
    rating: number;
    /**
     * @description Проект
     * @type string
    */
    project: string;
    /**
     * @description Рецензент
     * @type string
    */
    reviewer: string;
    /**
     * @description Пользователи, поставившие лайки
     * @type array
    */
    likes: string[];
    /**
     * @description Пользователи, поставившие дизлайки
     * @type array
    */
    dislikes: string[];
};