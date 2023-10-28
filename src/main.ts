import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import helmet from "helmet";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";

import { helmetConfigs, mainConfigs, sessionConfigs, swaggerConfig } from "utils/configs/main.configs";

import { AppModule } from "app/app.module";

async function bootstrap() {
	const app = await NestFactory.create<INestApplication<unknown>>(AppModule, mainConfigs);
	// cookieParser
	app.use(cookieParser());
	// session
	app.use(session(sessionConfigs));
	// headers
	app.use(helmet(helmetConfigs));
	// swagger apply on app
	SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, swaggerConfig));
	// etag setup options
	// (<any>app).set("etag", false);
	// listen
	await app.listen(3010);
}
// launcher
bootstrap();
