import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CurrentUserMiddleware } from "./user.middleware";

import { AuthService } from "./users.auth.service";

import { User } from "./user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./user.service";

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
})
export class UsersModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(CurrentUserMiddleware).forRoutes("*");
	}
}
