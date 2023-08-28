import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

import { MailService } from "./mail.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

@Module({
	imports: [
		MailerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				transport: {
					host: config.get("MAIL_HOST"),
					secure: false,
					auth: {
						user: config.get("MAIL_USER"),
						pass: config.get("MAIL_PASSWORD"),
					},
				},
				defaults: {
					from: `No Reply  <%= ${config.get("MAIL_FROM")} %>`,
				},
				template: {
					dir: path.join(__dirname, "templates"),
					adapter: new EjsAdapter(),
					options: {
						strict: true,
					},
				},
			}),
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
