
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
      "/api/v1/projects": {
        "post": {
          "operationId": "ProjectsController_createOne",
          "summary": "Create a new project",
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
          "summary": "Get a list of projects",
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
      "/api/v1/projects/{id}": {
        "get": {
          "operationId": "ProjectsController_findOneById",
          "summary": "Get a project by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Update a project by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Delete a project by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Create a new tag",
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
          "summary": "Get a list of tags",
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
      "/api/v1/tags/{id}": {
        "get": {
          "operationId": "TagsController_findOneById",
          "summary": "Get a tag by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Update a tag by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Delete a tag by ID",
          "parameters": [
            {
              "name": "id",
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
      "/api/v1/users": {
        "get": {
          "operationId": "UsersController_findAll",
          "summary": "Get a list of users",
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
      "/api/v1/users/{id}": {
        "get": {
          "operationId": "UsersController_findOneById",
          "summary": "Get a user by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Update a user by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Delete a user by ID",
          "parameters": [
            {
              "name": "id",
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
      "/api/v1/users/{username}": {
        "get": {
          "operationId": "UsersController_findOneByUsername",
          "summary": "Get a user by username",
          "parameters": [
            {
              "name": "username",
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
          "summary": "Create a new team",
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
          "summary": "Get a list of teams",
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
      "/api/v1/teams/{id}": {
        "get": {
          "operationId": "TeamsController_findOneById",
          "summary": "Get a team by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Update a team by ID",
          "parameters": [
            {
              "name": "id",
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
          "summary": "Delete a team by ID",
          "parameters": [
            {
              "name": "id",
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
      "/api/v1/auth/register": {
        "post": {
          "operationId": "AuthController_register",
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
      "description": "Это API",
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
        "CreateProjectDto": {
          "type": "object",
          "properties": {}
        },
        "Project": {
          "type": "object",
          "properties": {}
        },
        "UpdateProjectDto": {
          "type": "object",
          "properties": {}
        },
        "CreateTagDto": {
          "type": "object",
          "properties": {}
        },
        "Tag": {
          "type": "object",
          "properties": {}
        },
        "UpdateTagDto": {
          "type": "object",
          "properties": {}
        },
        "User": {
          "type": "object",
          "properties": {}
        },
        "UserNameDto": {
          "type": "object",
          "properties": {}
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "User identifier (optional)",
              "example": "john_doe"
            },
            "email": {
              "type": "string",
              "description": "User email (optional)",
              "example": "user@example.com"
            },
            "password": {
              "type": "string",
              "description": "User password (optional)"
            },
            "role": {
              "type": "string",
              "description": "User role (optional)",
              "enum": [
                "user",
                "admin"
              ],
              "example": "user"
            },
            "refresh_token": {
              "type": "string",
              "description": "Refresh token (optional)"
            },
            "name": {
              "description": "User name (optional)",
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserNameDto"
                }
              ]
            },
            "avatar": {
              "type": "string",
              "description": "User avatar URL (optional)"
            },
            "about": {
              "type": "string",
              "description": "Information about the user (optional)"
            }
          },
          "required": [
            "username",
            "email",
            "password",
            "role",
            "refresh_token",
            "name",
            "avatar",
            "about"
          ]
        },
        "CreateTeamDto": {
          "type": "object",
          "properties": {}
        },
        "Team": {
          "type": "object",
          "properties": {}
        },
        "UpdateTeamDto": {
          "type": "object",
          "properties": {}
        },
        "CreateUserDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "string",
              "description": "User identifier",
              "example": "john_doe"
            },
            "email": {
              "type": "string",
              "description": "User email",
              "example": "user@example.com"
            },
            "password": {
              "type": "string",
              "description": "User password"
            },
            "role": {
              "type": "string",
              "description": "User role (optional)",
              "enum": [
                "user",
                "admin"
              ],
              "example": "user"
            },
            "refresh_token": {
              "type": "string",
              "description": "Refresh token (optional)"
            },
            "name": {
              "description": "User name (optional)",
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserNameDto"
                }
              ]
            },
            "avatar": {
              "type": "string",
              "description": "User avatar URL (optional)"
            },
            "about": {
              "type": "string",
              "description": "Information about the user (optional)"
            }
          },
          "required": [
            "username",
            "email",
            "password",
            "role",
            "refresh_token",
            "name",
            "avatar",
            "about"
          ]
        },
        "SignInDto": {
          "type": "object",
          "properties": {}
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
