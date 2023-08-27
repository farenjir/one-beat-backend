import { Module } from "@nestjs/common";

import { CommonModule } from "global/global.module";

import { UsersModule } from "modules/user/user.module";

import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
	imports: [UsersModule, CommonModule],
	controllers: [AuthController],
	providers: [AuthService],
	exports: [AuthService],
})
export class AuthModule {}
