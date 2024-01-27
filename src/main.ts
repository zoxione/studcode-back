import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createWriteStream } from 'fs';
import { get } from 'http';
import { AppModule } from './app.module';
import configuration from './config/configuration';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api', { exclude: ['docs'] });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Студенческий код')
    .setDescription('Это открытое API для веб-приложения "Студенческий код".')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));
  SwaggerModule.setup('/swagger', app, document);

  await app.listen(configuration().port);
  const appUrl = await app.getUrl();
  console.log(`Application is running on: ${appUrl}`);

  // get the swagger json file (if app is running in development mode)
  if (configuration().node_env === 'development') {
    get(`${appUrl}/swagger-yaml`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-spec.yaml'));
      console.log(`Swagger YAML file written to: '/swagger-static/swagger-spec.yaml'`);
    });
    get(`${appUrl}/swagger/swagger-ui-bundle.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-bundle.js'));
      console.log(`Swagger UI bundle file written to: '/swagger-static/swagger-ui-bundle.js'`);
    });
    get(`${appUrl}/swagger/swagger-ui-init.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-init.js'));
      console.log(`Swagger UI init file written to: '/swagger-static/swagger-ui-init.js'`);
    });
    get(`${appUrl}/swagger/swagger-ui-standalone-preset.js`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui-standalone-preset.js'));
      console.log(`Swagger UI standalone preset file written to: '/swagger-static/swagger-ui-standalone-preset.js'`);
    });
    get(`${appUrl}/swagger/swagger-ui.css`, function (response) {
      response.pipe(createWriteStream('swagger-static/swagger-ui.css'));
      console.log(`Swagger UI css file written to: '/swagger-static/swagger-ui.css'`);
    });
  }
}
bootstrap();
