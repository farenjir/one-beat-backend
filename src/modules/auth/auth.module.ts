import { Module } from "@nestjs/common";

import { GlobalModule } from "global/global.module";

import { UsersModule } from "modules/user/user.module";
import { MailModule } from "modules/mail/mail.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
	imports: [UsersModule, MailModule, GlobalModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
