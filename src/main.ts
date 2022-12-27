import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()


  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  

  const config = new DocumentBuilder()
  .setTitle('Restaurants Backend')
  .setDescription('Reastaurants For Backend')
  .setVersion('0.0.1')
  .addBearerAuth()
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Retaurants Swagger API'
  })

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
