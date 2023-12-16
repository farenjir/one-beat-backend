import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "modules/user/users.module";
import { MailModule } from "modules/mail/mail.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
	imports: [JwtModule, UsersModule, MailModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
