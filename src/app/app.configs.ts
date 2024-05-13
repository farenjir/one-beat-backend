import type { NestApplicationOptions } from "@nestjs/common";
import type { HelmetOptions } from "helmet";

export const mainConfigs: NestApplicationOptions = {
	cors: {
		origin: ["'self'", "http://localhost:3003"],
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
			"script-src": ["'self'", "http://localhost:3003"],
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

export const COOKIE_SECRET = "cookie_secret_key";
export const COOKIE_TOKEN_KEY = "access_token";
export const cookieOptions = {
	path: "/",
	maxAge: 24 * 24 * 3600,
	httpOnly: true,
	secure: true,
};
