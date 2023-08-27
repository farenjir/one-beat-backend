import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";

import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

import { MailService } from "./mail.service";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

@Module({
	imports: [
		MailerModule.forRoot({
			// transport: 'smtps://user@example.com:topsecret@smtp.example.com',
			// or
			transport: {
				host: "smtp.example.com",
				secure: false,
				auth: {
					user: "user@example.com",
					pass: "topsecret",
				},
			},
			defaults: {
				from: '"No Reply" <noreply@example.com>',
			},
			template: {
				dir: path?.join(__dirname, "templates"),
				adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
				options: {
					strict: true,
				},
			},
		}),
	],
	providers: [MailService],
	exports: [MailService],
})
export class MailModule {}
