import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import * as cookieParser from "cookie-parser";
import * as session from "express-session";

import helmet from "helmet";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "app/app.module";

async function bootstrap() {
	const app = await NestFactory.create<INestApplication<any>>(AppModule, {
		// cors
		// bodyParser
		// httpsOptions
		// abortOnError
	});
	// cookieParser
	app.use(cookieParser());
	// session
	app.use(
		session({
			secret: "keyOfSession",
			resave: false,
			saveUninitialized: false,
		}),
	);
	// headers
	app.use(
		helmet({
			crossOriginEmbedderPolicy: false,
			xPoweredBy: false,
			contentSecurityPolicy: {
				directives: {
					imgSrc: [`'self'`],
					scriptSrc: [`'self'`],
					manifestSrc: [`'self'`],
					frameSrc: [`'self'`],
				},
			},
		}),
	);
	// swagger
	const config = new DocumentBuilder()
		.setTitle("1BEAT")
		.setDescription("api of 1BEAT")
		.setVersion("1.0")
		.addCookieAuth("app-token")
		.build();
	// swagger apply on app
	SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));
	// etag setup options
	(<any>app).set("etag", false);
	// listen
	await app.listen(3000);
}
// launcher
bootstrap();
