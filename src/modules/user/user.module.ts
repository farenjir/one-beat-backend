import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { CurrentUserMiddleware } from "./user.middleware";

import { AuthService } from "./users.auth.service";
import { UsersService } from "./user.service";

import { User } from "./user.entity";
import { UsersController } from "./users.controller";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			global: true,
			secret: process.env.JWT_KEY,
			signOptions: { expiresIn: "1d" },
		}),
	],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleware).forRoutes("*");
	}
}
