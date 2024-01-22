import { defineConfig } from '@kubb/core';
import createSwagger from '@kubb/swagger';
import createSwaggerTS from '@kubb/swagger-ts';

export default defineConfig(async () => {
  return {
    root: '.',
    input: {
      path: './swagger-static/swagger-spec.yaml',
    },
    output: {
      path: './generate-types',
    },
    plugins: [
      createSwagger({
        output: false,
        validate: true,
      }),
      createSwaggerTS({
        output: {
          path: 'models',
        },
        enumType: 'asPascalConst',
        dateType: 'string',
        optionalType: 'undefined',
      }),
    ],
  };
});
