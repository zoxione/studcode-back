
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_mainInfo",
          "summary": "Основная информация",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "app"
          ]
        }
      },
      "/api/v1/projects": {
        "post": {
          "operationId": "ProjectsController_createOne",
          "summary": "Создание нового проекта",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProjectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "ProjectsController_findAll",
          "summary": "Получение списка проектов",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/projects/{key}": {
        "get": {
          "operationId": "ProjectsController_findOne",
          "summary": "Получение проекта по _id/slug",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "ProjectsController_updateOne",
          "summary": "Обновление проекта по _id/slug",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateProjectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "ProjectsController_deleteOne",
          "summary": "Удаление проекта по _id/slug",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/projects/{key}/uploads": {
        "post": {
          "operationId": "ProjectsController_uploadFiles",
          "summary": "Загрузка файлов проекта по _id/slug",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/projects/{key}/vote": {
        "post": {
          "operationId": "ProjectsController_voteOne",
          "summary": "Голосование за проект по _id/slug",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Project"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "projects"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/tags": {
        "post": {
          "operationId": "TagsController_createOne",
          "summary": "Создание нового тега",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateTagDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Tag"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "tags"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "TagsController_findAll",
          "summary": "Получение списка тегов",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Tag"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "tags"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/tags/popular": {
        "get": {
          "operationId": "TagsController_findAllPopular",
          "summary": "Получение списка популярных тегов",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Tag"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "tags"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/tags/{key}": {
        "get": {
          "operationId": "TagsController_findOne",
          "summary": "Получение тега по _id/slug",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Tag"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "tags"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/specializations": {
        "post": {
          "operationId": "SpecializationsController_createOne",
          "summary": "Создание новой специализации",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSpecializationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Specialization"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "specializations"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "SpecializationsController_findAll",
          "summary": "Получение списка специализаций",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Specialization"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "specializations"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/specializations/{key}": {
        "get": {
          "operationId": "SpecializationsController_findOne",
          "summary": "Получение специализации по _id",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Specialization"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "specializations"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/users": {
        "get": {
          "operationId": "UsersController_findAll",
          "summary": "Получение списка пользователей",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/users/{key}": {
        "get": {
          "operationId": "UsersController_findOne",
          "summary": "Получение пользователя по _id/username/email",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "UsersController_updateOne",
          "summary": "Обновление пользователя по _id/username/email",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success"
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/users/{key}/uploads": {
        "post": {
          "operationId": "UsersController_uploadFiles",
          "summary": "Загрузка файлов пользователя по _id/username/email",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/teams": {
        "post": {
          "operationId": "TeamsController_createOne",
          "summary": "Создание новой команды",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateTeamDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "TeamsController_findAll",
          "summary": "Получение списка команд",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/teams/{key}": {
        "get": {
          "operationId": "TeamsController_findOne",
          "summary": "Получение команды по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "TeamsController_updateOne",
          "summary": "Обновление команды по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateTeamDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "TeamsController_deleteOne",
          "summary": "Удаление команды по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/teams/{key}/uploads": {
        "post": {
          "operationId": "TeamsController_uploadFiles",
          "summary": "Загрузка файлов команды по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success"
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/teams/{key}/members": {
        "put": {
          "operationId": "TeamsController_updateMembers",
          "summary": "Обновление участников команды по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateTeamMembersDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/teams/{key}/members/add": {
        "put": {
          "operationId": "TeamsController_addMember",
          "summary": "Добавление участника в команду по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TeamMemberDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/teams/{key}/members/remove": {
        "put": {
          "operationId": "TeamsController_removeMember",
          "summary": "Удаление участника из команды по _id/name",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TeamMemberDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Team"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "teams"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/reviews": {
        "post": {
          "operationId": "ReviewsController_createOne",
          "summary": "Создание нового обзора",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateReviewDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "ReviewsController_findAll",
          "summary": "Получение списка обзоров",
          "parameters": [
            {
              "name": "project_id",
              "required": true,
              "in": "query",
              "description": "Идентификатор проекта",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "user_id",
              "required": true,
              "in": "query",
              "description": "Идентификатор пользователя",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/reviews/{key}": {
        "get": {
          "operationId": "ReviewsController_findOne",
          "summary": "Получение обзора по _id",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "ReviewsController_updateOne",
          "summary": "Обновление обзора по _id",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateReviewDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "ReviewsController_deleteOne",
          "summary": "Удаление обзора по _id",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/reviews/{key}/like": {
        "post": {
          "operationId": "ReviewsController_likeOne",
          "summary": "Лайк обзора по _id",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/reviews/{key}/dislike": {
        "post": {
          "operationId": "ReviewsController_dislikeOne",
          "summary": "Дизлайк обзора по _id",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Review"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            },
            "404": {
              "description": "Not Found"
            }
          },
          "tags": [
            "reviews"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/register": {
        "post": {
          "operationId": "AuthController_register",
          "summary": "Регистрация нового пользователя",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateUserDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "summary": "Аутентификация пользователя",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SignInDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/logout": {
        "get": {
          "operationId": "AuthController_logout",
          "summary": "Выход из аккаунта",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/refresh": {
        "get": {
          "operationId": "AuthController_refreshTokens",
          "summary": "Обновление токенов",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/whoami": {
        "get": {
          "operationId": "AuthController_whoami",
          "summary": "Получение информации о текущем пользователе",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/auth/verify": {
        "get": {
          "operationId": "AuthController_verifyEmail",
          "summary": "Подтверждение почты",
          "parameters": [
            {
              "name": "token",
              "required": true,
              "in": "query",
              "description": "Токен",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "auth"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      }
    },
    "info": {
      "title": "Студенческий код",
      "description": "Это открытое API для веб-приложения \"Студенческий код\".",
      "version": "1.2.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "LinkDto": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "description": "Тип",
              "enum": [
                "main",
                "github",
                "gitlab",
                "vk",
                "telegram",
                "discord",
                "youtube",
                "other"
              ]
            },
            "label": {
              "type": "string",
              "description": "Метка"
            },
            "url": {
              "type": "string",
              "description": "URL"
            }
          },
          "required": [
            "type",
            "label",
            "url"
          ]
        },
        "CreateProjectDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Название"
            },
            "tagline": {
              "type": "string",
              "description": "Слоган"
            },
            "status": {
              "type": "string",
              "description": "Статус",
              "enum": [
                "draft",
                "published",
                "archived"
              ]
            },
            "type": {
              "type": "string",
              "description": "Тип",
              "enum": [
                "web",
                "mobile",
                "desktop",
                "iot",
                "game",
                "ui_ux",
                "other"
              ]
            },
            "description": {
              "type": "string",
              "description": "Описание"
            },
            "flames": {
              "type": "number",
              "description": "Количество огоньков"
            },
            "links": {
              "description": "Ссылки",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/LinkDto"
              }
            },
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "screenshots": {
              "description": "Скриншоты",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "price": {
              "type": "string",
              "description": "Цена",
              "enum": [
                "free",
                "free_options",
                "payment_required"
              ]
            },
            "rating": {
              "type": "number",
              "description": "Рейтинг"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            },
            "creator": {
              "type": "string",
              "description": "Создатель"
            },
            "team": {
              "type": "string",
              "description": "Команда"
            },
            "tags": {
              "description": "Теги",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "title",
            "tagline",
            "status",
            "type",
            "description",
            "flames",
            "links",
            "logo",
            "screenshots",
            "price",
            "rating",
            "slug",
            "creator",
            "team",
            "tags"
          ]
        },
        "ObjectId": {
          "type": "object",
          "properties": {}
        },
        "Link": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "description": "Тип",
              "enum": [
                "main",
                "github",
                "gitlab",
                "vk",
                "telegram",
                "discord",
                "youtube",
                "other"
              ]
            },
            "label": {
              "type": "string",
              "description": "Метка"
            },
            "url": {
              "type": "string",
              "description": "URL"
            }
          },
          "required": [
            "type",
            "label",
            "url"
          ]
        },
        "UserFullName": {
          "type": "object",
          "properties": {
            "surname": {
              "type": "string",
              "description": "Фамилия"
            },
            "name": {
              "type": "string",
              "description": "Имя"
            },
            "patronymic": {
              "type": "string",
              "description": "Отчество"
            }
          },
          "required": [
            "surname",
            "name",
            "patronymic"
          ]
        },
        "Specialization": {
          "type": "object",
          "properties": {
            "_id": {
              "description": "Идентификатор",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "name": {
              "type": "string",
              "description": "Название"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            }
          },
          "required": [
            "_id",
            "name",
            "description"
          ]
        },
        "User": {
          "type": "object",
          "properties": {
            "_id": {
              "description": "Идентификатор",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "username": {
              "type": "string",
              "description": "Имя пользователя"
            },
            "email": {
              "type": "string",
              "description": "Электронная почта"
            },
            "password": {
              "type": "string",
              "description": "Пароль"
            },
            "role": {
              "type": "string",
              "description": "Роль",
              "enum": [
                "user",
                "admin"
              ]
            },
            "verify_email": {
              "type": "string",
              "description": "Подтверждение почты"
            },
            "refresh_token": {
              "type": "string",
              "description": "Токен обновления"
            },
            "full_name": {
              "description": "ФИО",
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserFullName"
                }
              ]
            },
            "avatar": {
              "type": "string",
              "description": "Ссылка на аватар"
            },
            "about": {
              "type": "string",
              "description": "О себе"
            },
            "links": {
              "description": "Ссылки",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Link"
              }
            },
            "specializations": {
              "description": "Специализации",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Specialization"
              }
            }
          },
          "required": [
            "_id",
            "username",
            "email",
            "password",
            "role",
            "verify_email",
            "refresh_token",
            "full_name",
            "avatar",
            "about",
            "links",
            "specializations"
          ]
        },
        "TeamMember": {
          "type": "object",
          "properties": {
            "user": {
              "description": "Идентификатор участника",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "role": {
              "type": "string",
              "description": "Роль",
              "enum": [
                "owner",
                "member"
              ]
            }
          },
          "required": [
            "user",
            "role"
          ]
        },
        "Team": {
          "type": "object",
          "properties": {
            "_id": {
              "description": "Идентификатор",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "name": {
              "type": "string",
              "description": "Название"
            },
            "about": {
              "type": "string",
              "description": "О команде"
            },
            "status": {
              "type": "string",
              "description": "Статус",
              "enum": [
                "opened",
                "closed"
              ]
            },
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            },
            "members": {
              "description": "Участники",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TeamMember"
              }
            }
          },
          "required": [
            "_id",
            "name",
            "about",
            "status",
            "logo",
            "slug",
            "members"
          ]
        },
        "Tag": {
          "type": "object",
          "properties": {
            "_id": {
              "description": "Идентификатор",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "name": {
              "type": "string",
              "description": "Название"
            },
            "icon": {
              "type": "string",
              "description": "Ссылка на иконку"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            }
          },
          "required": [
            "_id",
            "name",
            "icon",
            "description",
            "slug"
          ]
        },
        "Project": {
          "type": "object",
          "properties": {
            "_id": {
              "description": "Идентификатор",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "title": {
              "type": "string",
              "description": "Название"
            },
            "tagline": {
              "type": "string",
              "description": "Слоган"
            },
            "status": {
              "type": "string",
              "description": "Статус",
              "enum": [
                "draft",
                "published",
                "archived"
              ]
            },
            "type": {
              "type": "string",
              "description": "Тип",
              "enum": [
                "web",
                "mobile",
                "desktop",
                "iot",
                "game",
                "ui_ux",
                "other"
              ]
            },
            "description": {
              "type": "string",
              "description": "Описание"
            },
            "flames": {
              "type": "number",
              "description": "Количество огоньков"
            },
            "links": {
              "description": "Ссылки",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Link"
              }
            },
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "screenshots": {
              "description": "Скриншоты",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "price": {
              "type": "string",
              "description": "Цена",
              "enum": [
                "free",
                "free_options",
                "payment_required"
              ]
            },
            "rating": {
              "type": "number",
              "description": "Рейтинг"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            },
            "creator": {
              "description": "Создатель",
              "allOf": [
                {
                  "$ref": "#/components/schemas/User"
                }
              ]
            },
            "team": {
              "description": "Команда",
              "allOf": [
                {
                  "$ref": "#/components/schemas/Team"
                }
              ]
            },
            "tags": {
              "description": "Теги",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Tag"
              }
            }
          },
          "required": [
            "_id",
            "title",
            "tagline",
            "status",
            "type",
            "description",
            "flames",
            "links",
            "logo",
            "screenshots",
            "price",
            "rating",
            "slug",
            "creator",
            "team",
            "tags"
          ]
        },
        "UpdateProjectDto": {
          "type": "object",
          "properties": {}
        },
        "CreateTagDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Название"
            },
            "icon": {
              "type": "string",
              "description": "Ссылка на иконку"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            }
          },
          "required": [
            "name",
            "icon",
            "description",
            "slug"
          ]
        },
        "CreateSpecializationDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Название"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            }
          },
          "required": [
            "name",
            "description"
          ]
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {}
        },
        "TeamMemberDto": {
          "type": "object",
          "properties": {
            "user": {
              "type": "string",
              "description": "Пользователь"
            },
            "role": {
              "type": "string",
              "description": "Роль",
              "enum": [
                "owner",
                "member"
              ]
            }
          },
          "required": [
            "user",
            "role"
          ]
        },
        "CreateTeamDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string",
              "description": "Название"
            },
            "about": {
              "type": "string",
              "description": "О команде"
            },
            "status": {
              "type": "string",
              "description": "Статус",
              "enum": [
                "opened",
                "closed"
              ]
            },
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            },
            "members": {
              "description": "Участники",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/TeamMemberDto"
              }
            }
          },
          "required": [
            "name",
            "about",
            "status",
            "logo",
            "slug",
            "members"
          ]
        },
        "UpdateTeamDto": {
          "type": "object",
          "properties": {}
        },
        "UpdateTeamMembersItemDto": {
          "type": "object",
          "properties": {
            "member": {
              "description": "Участник",
              "allOf": [
                {
                  "$ref": "#/components/schemas/TeamMemberDto"
                }
              ]
            },
            "action": {
              "type": "string",
              "description": "Действие",
              "enum": [
                "add",
                "remove"
              ]
            }
          },
          "required": [
            "member",
            "action"
          ]
        },
        "UpdateTeamMembersDto": {
          "type": "object",
          "properties": {
            "members": {
              "description": "Участники",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/UpdateTeamMembersItemDto"
              }
            }
          },
          "required": [
            "members"
          ]
        },
        "CreateReviewDto": {
          "type": "object",
          "properties": {
            "text": {
              "type": "string",
              "description": "Текст"
            },
            "rating": {
              "type": "number",
              "description": "Оценка"
            },
            "likes": {
              "type": "number",
              "description": "Количество лайков"
            },
            "dislikes": {
              "type": "number",
              "description": "Количество дизлайков"
            },
            "project": {
              "type": "string",
              "description": "Проект"
            },
            "reviewer": {
              "type": "string",
              "description": "Рецензент"
            }
          },
          "required": [
            "text",
            "rating",
            "likes",
            "dislikes",
            "project",
            "reviewer"
          ]
        },
        "Review": {
          "type": "object",
          "properties": {
            "_id": {
              "description": "Идентификатор",
              "allOf": [
                {
                  "$ref": "#/components/schemas/ObjectId"
                }
              ]
            },
            "text": {
              "type": "string",
              "description": "Текст"
            },
            "rating": {
              "type": "number",
              "description": "Оценка"
            },
            "likes": {
              "type": "number",
              "description": "Количество лайков"
            },
            "dislikes": {
              "type": "number",
              "description": "Количество дизлайков"
            },
            "project": {
              "description": "Проект",
              "allOf": [
                {
                  "$ref": "#/components/schemas/Project"
                }
              ]
            },
            "reviewer": {
              "description": "Рецензент",
              "allOf": [
                {
                  "$ref": "#/components/schemas/User"
                }
              ]
            }
          },
          "required": [
            "_id",
            "text",
            "rating",
            "likes",
            "dislikes",
            "project",
            "reviewer"
          ]
        },
        "UpdateReviewDto": {
          "type": "object",
          "properties": {}
        },
        "UserFullNameDto": {
          "type": "object",
          "properties": {
            "surname": {
              "type": "string",
              "description": "Фамилия"
            },
            "name": {
              "type": "string",
              "description": "Имя"
            },
            "patronymic": {
              "type": "string",
              "description": "Отчество"
            }
          },
          "required": [
            "surname",
            "name",
            "patronymic"
          ]
        },
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "Имя пользователя"
            },
            "email": {
              "type": "string",
              "description": "Электронная почта"
            },
            "password": {
              "type": "string",
              "description": "Пароль"
            },
            "role": {
              "type": "string",
              "description": "Роль",
              "enum": [
                "user",
                "admin"
              ]
            },
            "verify_email": {
              "type": "string",
              "description": "Подтверждение почты"
            },
            "refresh_token": {
              "type": "string",
              "description": "Токен обновления"
            },
            "full_name": {
              "description": "ФИО",
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserFullNameDto"
                }
              ]
            },
            "avatar": {
              "type": "string",
              "description": "Ссылка на аватар"
            },
            "about": {
              "type": "string",
              "description": "О себе"
            },
            "links": {
              "description": "Ссылки",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/LinkDto"
              }
            },
            "specializations": {
              "description": "Специализации",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "username",
            "email",
            "password",
            "role",
            "verify_email",
            "refresh_token",
            "full_name",
            "avatar",
            "about",
            "links",
            "specializations"
          ]
        },
        "SignInDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "description": "Электронная почта"
            },
            "password": {
              "type": "string",
              "description": "Пароль"
            }
          },
          "required": [
            "email",
            "password"
          ]
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
