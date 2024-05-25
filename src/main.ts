import type { NestExpressApplication } from "@nestjs/platform-express";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";

import { COOKIE_SECRET, helmetConfigs, mainConfigs, sessionConfigs } from "app/app.configs";

import { AppModule } from "app/app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, mainConfigs);
	// cookie
	app.use(cookieParser(COOKIE_SECRET));
	// session
	app.use(session(sessionConfigs));
	// headers
	app.use(helmet(helmetConfigs));
	// swagger apply on app
	SwaggerModule.setup(
		"app-api",
		app,
		SwaggerModule.createDocument(
			app,
			new DocumentBuilder()
			.setTitle("1BEAT")
			.setDescription("api of 1BEAT")
			.setVersion("1.0")
			.build(),
		),
	);
	// etag setup options
	// (<any>app).set("etag", false);
	// listen
	await app.listen(3010); // "0.0.0.0"
}
// launcher
bootstrap();
