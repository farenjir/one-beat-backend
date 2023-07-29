import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { AuthService } from "./users.auth.service";
import { UsersService } from "./user.service";

import { User } from "./user.entity";
import { UsersController } from "./users.controller";

@Module({
	imports: [TypeOrmModule.forFeature([User]), JwtModule],
	controllers: [UsersController],
	providers: [UsersService, AuthService],
})
export class UsersModule {}
