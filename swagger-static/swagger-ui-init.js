
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
          "operationId": "ProjectsController_findOneById",
          "summary": "Получение проекта по ID",
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
          "operationId": "ProjectsController_updateOneById",
          "summary": "Обновление проекта по ID",
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
          "operationId": "ProjectsController_deleteOneById",
          "summary": "Удаление проекта по ID",
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
      "/api/v1/projects/vote/{key}": {
        "put": {
          "operationId": "ProjectsController_voteOneById",
          "summary": "Голосование за проект по ID",
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
      "/api/v1/tags/{key}": {
        "get": {
          "operationId": "TagsController_findOneById",
          "summary": "Получение тега по ID/slug",
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
        },
        "put": {
          "operationId": "TagsController_updateOneById",
          "summary": "Обновление тега по ID/slug",
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
                  "$ref": "#/components/schemas/UpdateTagDto"
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
        },
        "delete": {
          "operationId": "TagsController_deleteOneById",
          "summary": "Удаление тега по ID/slug",
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
      "/api/v1/votes": {
        "post": {
          "operationId": "VotesController_createOne",
          "summary": "Создание нового голоса",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateVoteDto"
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
                    "$ref": "#/components/schemas/Vote"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "votes"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "VotesController_findAll",
          "summary": "Получение списка голосов",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Vote"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "votes"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/votes/{key}": {
        "get": {
          "operationId": "VotesController_findOneById",
          "summary": "Получение голоса по ID",
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
                    "$ref": "#/components/schemas/Vote"
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
            "votes"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "VotesController_updateOneById",
          "summary": "Обновление голоса по ID",
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
                  "$ref": "#/components/schemas/UpdateVoteDto"
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
                    "$ref": "#/components/schemas/Vote"
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
            "votes"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "VotesController_deleteOneById",
          "summary": "Удаление голоса по ID",
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
                    "$ref": "#/components/schemas/Vote"
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
            "votes"
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
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
                  }
                }
              }
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
          "operationId": "UsersController_findOneById",
          "summary": "Получение пользователя по ID/username/email",
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
                    "$ref": "#/components/schemas/User"
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
            "users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "UsersController_updateOneById",
          "summary": "Обновление пользователя по ID/username/email",
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
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/User"
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
            "users"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "UsersController_deleteOneById",
          "summary": "Удаление пользователя по ID/username/email",
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
                    "$ref": "#/components/schemas/User"
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
          "operationId": "TeamsController_findOneById",
          "summary": "Получение команды по ID",
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
          "operationId": "TeamsController_updateOneById",
          "summary": "Обновление команды по ID",
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
          "operationId": "TeamsController_deleteOneById",
          "summary": "Удаление команды по ID",
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
      "/api/v1/awards": {
        "post": {
          "operationId": "AwardsController_createOne",
          "summary": "Создание новой награды",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateAwardDto"
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
                    "$ref": "#/components/schemas/Award"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "awards"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "get": {
          "operationId": "AwardsController_findAll",
          "summary": "Получение списка наград",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/Award"
                  }
                }
              }
            },
            "401": {
              "description": "Unauthorized"
            }
          },
          "tags": [
            "awards"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        }
      },
      "/api/v1/awards/{key}": {
        "get": {
          "operationId": "AwardsController_findOneById",
          "summary": "Получение награды по ID",
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
                    "$ref": "#/components/schemas/Award"
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
            "awards"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "put": {
          "operationId": "AwardsController_updateOneById",
          "summary": "Обновление награды по ID",
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
                  "$ref": "#/components/schemas/UpdateAwardDto"
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
                    "$ref": "#/components/schemas/Award"
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
            "awards"
          ],
          "security": [
            {
              "bearer": []
            }
          ]
        },
        "delete": {
          "operationId": "AwardsController_deleteOneById",
          "summary": "Удаление награды по ID",
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
                    "$ref": "#/components/schemas/Award"
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
            "awards"
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
          "parameters": [],
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
          "operationId": "ReviewsController_findOneById",
          "summary": "Получение обзора по ID",
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
          "operationId": "ReviewsController_updateOneById",
          "summary": "Обновление обзора по ID",
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
          "operationId": "ReviewsController_deleteOneById",
          "summary": "Удаление обзора по ID",
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
      }
    },
    "info": {
      "title": "Студенческий код",
      "description": "Это открытое API для веб-приложения \"Студенческий код\".",
      "version": "1.0",
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
        "ProjectLinksDto": {
          "type": "object",
          "properties": {
            "main": {
              "type": "string",
              "description": "Основная ссылка"
            },
            "github": {
              "type": "string",
              "description": "Ссылка на GitHub"
            },
            "demo": {
              "type": "string",
              "description": "Ссылка на демо"
            }
          },
          "required": [
            "main",
            "github",
            "demo"
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
              "allOf": [
                {
                  "$ref": "#/components/schemas/ProjectLinksDto"
                }
              ]
            },
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "screenshots": {
              "description": "Массив скриншотов",
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
            "tags": {
              "description": "Теги",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "creator": {
              "type": "string",
              "description": "Создатель"
            }
          },
          "required": [
            "title",
            "tagline",
            "status",
            "description",
            "flames",
            "links",
            "logo",
            "screenshots",
            "price",
            "rating",
            "tags",
            "creator"
          ]
        },
        "ObjectId": {
          "type": "object",
          "properties": {}
        },
        "TagNameDto": {
          "type": "object",
          "properties": {
            "en": {
              "type": "string",
              "description": "Название на английском"
            },
            "ru": {
              "type": "string",
              "description": "Название на русском"
            }
          },
          "required": [
            "en",
            "ru"
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
              "description": "Название",
              "allOf": [
                {
                  "$ref": "#/components/schemas/TagNameDto"
                }
              ]
            },
            "icon": {
              "type": "string",
              "description": "Ссылка на иконку"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            }
          },
          "required": [
            "_id",
            "name",
            "icon",
            "slug",
            "description"
          ]
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
        "UserLinksDto": {
          "type": "object",
          "properties": {
            "github": {
              "type": "string",
              "description": "Гитхаб"
            },
            "vkontakte": {
              "type": "string",
              "description": "Вконтакте"
            },
            "telegram": {
              "type": "string",
              "description": "Телеграм"
            }
          },
          "required": [
            "github",
            "vkontakte",
            "telegram"
          ]
        },
        "AwardNameDto": {
          "type": "object",
          "properties": {
            "en": {
              "type": "string",
              "description": "Название на английском"
            },
            "ru": {
              "type": "string",
              "description": "Название на русском"
            }
          },
          "required": [
            "en",
            "ru"
          ]
        },
        "Award": {
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
              "description": "Название",
              "allOf": [
                {
                  "$ref": "#/components/schemas/AwardNameDto"
                }
              ]
            },
            "icon": {
              "type": "string",
              "description": "Ссылка на иконку"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            }
          },
          "required": [
            "_id",
            "name",
            "icon",
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
              "type": "boolean",
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
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserLinksDto"
                }
              ]
            },
            "awards": {
              "description": "Награды",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Award"
              }
            },
            "projects": {
              "description": "Проекты",
              "type": "array",
              "items": {
                "type": "array"
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
            "awards",
            "projects"
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
              "allOf": [
                {
                  "$ref": "#/components/schemas/ProjectLinksDto"
                }
              ]
            },
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "screenshots": {
              "description": "Массив скриншотов",
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
            "tags": {
              "description": "Теги",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Tag"
              }
            },
            "creator": {
              "description": "Создатель",
              "allOf": [
                {
                  "$ref": "#/components/schemas/User"
                }
              ]
            }
          },
          "required": [
            "_id",
            "title",
            "tagline",
            "status",
            "description",
            "flames",
            "links",
            "logo",
            "screenshots",
            "price",
            "rating",
            "tags",
            "creator"
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
              "description": "Название",
              "allOf": [
                {
                  "$ref": "#/components/schemas/TagNameDto"
                }
              ]
            },
            "icon": {
              "type": "string",
              "description": "Ссылка на иконку"
            },
            "slug": {
              "type": "string",
              "description": "Ключевое слово"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            }
          },
          "required": [
            "name",
            "icon",
            "slug",
            "description"
          ]
        },
        "UpdateTagDto": {
          "type": "object",
          "properties": {}
        },
        "CreateVoteDto": {
          "type": "object",
          "properties": {
            "project": {
              "type": "string",
              "description": "Проект"
            },
            "voter": {
              "type": "string",
              "description": "Голосующий"
            }
          },
          "required": [
            "project",
            "voter"
          ]
        },
        "Vote": {
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
            "project": {
              "description": "Проект",
              "allOf": [
                {
                  "$ref": "#/components/schemas/Project"
                }
              ]
            },
            "voter": {
              "description": "Голосующий",
              "allOf": [
                {
                  "$ref": "#/components/schemas/User"
                }
              ]
            }
          },
          "required": [
            "_id",
            "project",
            "voter"
          ]
        },
        "UpdateVoteDto": {
          "type": "object",
          "properties": {}
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {}
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
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "users": {
              "description": "Участники",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "projects": {
              "description": "Проекты",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "name",
            "about",
            "logo",
            "users",
            "projects"
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
            "logo": {
              "type": "string",
              "description": "Ссылка на логотип"
            },
            "users": {
              "description": "Участники",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/User"
              }
            },
            "projects": {
              "description": "Проекты",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Project"
              }
            }
          },
          "required": [
            "_id",
            "name",
            "about",
            "logo",
            "users",
            "projects"
          ]
        },
        "UpdateTeamDto": {
          "type": "object",
          "properties": {}
        },
        "CreateAwardDto": {
          "type": "object",
          "properties": {
            "name": {
              "description": "Название",
              "allOf": [
                {
                  "$ref": "#/components/schemas/AwardNameDto"
                }
              ]
            },
            "icon": {
              "type": "string",
              "description": "Ссылка на иконку"
            },
            "description": {
              "type": "string",
              "description": "Описание"
            }
          },
          "required": [
            "name",
            "icon",
            "description"
          ]
        },
        "UpdateAwardDto": {
          "type": "object",
          "properties": {}
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
              "description": "Текст"
            },
            "project": {
              "type": "string",
              "description": "Проект"
            },
            "reviewer": {
              "type": "string",
              "description": "Рецензент"
            },
            "likes": {
              "description": "Пользователи, поставившие лайки",
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "dislikes": {
              "description": "Пользователи, поставившие дизлайки",
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "text",
            "rating",
            "project",
            "reviewer",
            "likes",
            "dislikes"
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
            },
            "likes": {
              "description": "Пользователи, поставившие лайки",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ObjectId"
              }
            },
            "dislikes": {
              "description": "Пользователи, поставившие дизлайки",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ObjectId"
              }
            }
          },
          "required": [
            "_id",
            "text",
            "rating",
            "project",
            "reviewer",
            "likes",
            "dislikes"
          ]
        },
        "UpdateReviewDto": {
          "type": "object",
          "properties": {}
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
              "type": "boolean",
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
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserLinksDto"
                }
              ]
            },
            "awards": {
              "description": "Награды",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Award"
              }
            },
            "projects": {
              "description": "Проекты",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/Project"
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
            "awards",
            "projects"
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
