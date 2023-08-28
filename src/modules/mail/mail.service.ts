import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { UserDto } from "modules/user/user.dto";

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private config: ConfigService,
	) {}
	// sendUserConfirmation
	async sendUserConfirmation(user: Partial<UserDto>, token: string) {
		const baseUrl = this.config.get("BASE_URL");
		const url = `${baseUrl}/auth/confirm/${token}`;
		// sendMail
		await this.mailerService.sendMail({
			to: user.email,
			// from: '"Support Team" <support@example.com>', // override default from
			subject: "Welcome to Nice App! Confirm your Email",
			template: "./confirmation",
			context: {
				name: user.username,
				url,
			},
		});
	}
}
