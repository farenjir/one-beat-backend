import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";

import { UserDto } from "modules/user/user.dto";

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private config: ConfigService,
	) {}
	private baseUrl = this.config.get("BASE_URL");
	// services
	async sendUserPassword(user: Partial<UserDto>, token: string) {
		const url = `${this.baseUrl}/auth/forget/${token}`;
		// sendMail
		await this.mailerService.sendMail({
			to: user.email,
			subject: "Forget Password",
			template: "./forgetPassword",
			context: {
				name: user.username,
				url,
			},
		});
	}
	async sendUserConfirmation(user: Partial<UserDto>, token: string) {
		const url = `${this.baseUrl}/auth/confirm/${token}`;
		// sendMail
		await this.mailerService.sendMail({
			to: user.email,
			subject: "Welcome to Nice App! Confirm your Email",
			template: "./confirmation",
			context: {
				name: user.username,
				url,
			},
		});
	}
}
