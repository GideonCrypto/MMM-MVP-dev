import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Crypto Portfolio API')
    .setDescription('API docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // URL http://localhost:3000/api
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // app.enableCors({
  //   origin: 'http://localhost:5173',
  //   credentials: true,
  // })
  app.enableCors({
    // @ts-ignore
    origin: (origin, cb) => cb(null, true), // Разрешаем всё локально
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
