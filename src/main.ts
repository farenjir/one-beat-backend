import { NestFactory } from "@nestjs/core";

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
	(app as any).set("etag", false);
	// Res and Req configs
	app.use((req, res, next) => {
		res.removeHeader("x-powered-by");
		res.removeHeader("date");
		// next
		next();
	});
	// listen
	await app.listen(3000);
}
// launcher
bootstrap();
