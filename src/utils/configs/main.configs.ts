import { NestApplicationOptions } from "@nestjs/common/interfaces/nest-application-options.interface";
import { HelmetOptions } from "helmet";
import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
	.setTitle("1BEAT")
	.setDescription("api of 1BEAT")
	.setVersion("1.0")
	.addCookieAuth("app-token")
	.build();

export const mainConfigs: NestApplicationOptions = {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	},
	// bodyParser
	// httpsOptions
	// abortOnError
};

export const helmetConfigs: Readonly<HelmetOptions> = {
	crossOriginResourcePolicy: { policy: "same-site" },
	crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
	crossOriginEmbedderPolicy: { policy: "credentialless" },
	contentSecurityPolicy: {
		directives: {
			"script-src": ["'self'", "http://localhost:3000"],
		},
	},
	xXssProtection: true,
	xPoweredBy: false,
};

export const sessionConfigs = {
	secret: "keyOfSession",
	resave: false,
	saveUninitialized: false,
};

export const COOKIE_Key = "app-token";
export const cookieOptions = {
	path: "/",
	maxAge: 24 * 24 * 3600,
	httpOnly: true,
	secure: true,
};
