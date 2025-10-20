// src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express'; // <-- Added for Express features
import { join } from 'path'; // <-- Added for file path resolution

async function bootstrap() {
  // ✅ Create an Express-based NestJS app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Global API prefix
  app.setGlobalPrefix('api/v1');

  // ✅ Global validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove extra fields
      forbidNonWhitelisted: true, // throw error if unknown fields exist
      transform: true, // transform payloads into DTO classes
    }),
  );

  // ✅ Serve static files from the "uploads" folder
  // Use join(__dirname, '..', 'uploads') so it works after build (in dist/)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Access files via /uploads/<filename>
  });

  // ✅ Start the application
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
