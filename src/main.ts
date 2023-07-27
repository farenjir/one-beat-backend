import { NestFactory } from "@nestjs/core";

import helmet from "helmet";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

import { AppModule } from "app/app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		// logger: ["debug", "error", "log", "warn", "verbose"],
		// cors
		// bodyParser
		// httpsOptions
		// abortOnError
	});
	// etag setup options
	(<any>app).set("etag", false);
	// session
	// import * as session from "express-session";
	// app.use(
	// 	session({
	// 		secret: "my-secret",
	// 		resave: false,
	// 		saveUninitialized: false,
	// 	}),
	// );
	// header configs
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
		.build();
	// swagger apply on app
	SwaggerModule.setup("api", app, SwaggerModule.createDocument(app, config));
	// listen
	await app.listen(3000);
}
// launcher
bootstrap();
