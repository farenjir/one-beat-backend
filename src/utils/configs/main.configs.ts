import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
	.setTitle("1BEAT")
	.setDescription("api of 1BEAT")
	.setVersion("1.0")
	.addCookieAuth("app-token")
	.build();

export const mainConfigs = {
	cors: {
		origin: ["http://localhost:3000"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	},
	// bodyParser
	// httpsOptions
	// abortOnError
};

export const sessionConfigs = {
	secret: "keyOfSession",
	resave: false,
	saveUninitialized: false,
};

export const helmetConfigs = {
	crossOriginEmbedderPolicy: false,
	crossOriginOpenerPolicy: false,
	xPoweredBy: false,
	contentSecurityPolicy: {
		directives: {
			imgSrc: [`'self'`],
			scriptSrc: [`'self'`],
			manifestSrc: [`'self'`],
			frameSrc: [`'self'`],
		},
	},
};

export const COOKIE_Key = "app-token";
export const cookieOptions = {
	path: "/",
	maxAge: 24 * 24 * 3600,
	httpOnly: true,
	secure: true,
};
