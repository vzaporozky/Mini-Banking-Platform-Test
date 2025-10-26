import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: process.env.FRONTEND_URL || 'http://localhost:3000',
		credentials: true,
	});

	// Global validation pipe - temporarily disabled
	// app.useGlobalPipes(
	// 	new ValidationPipe({
	// 		whitelist: true,
	// 		forbidNonWhitelisted: true,
	// 		transform: true,
	// 	})
	// );

	const port = process.env.PORT || 3001;
	await app.listen(port);
	console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
