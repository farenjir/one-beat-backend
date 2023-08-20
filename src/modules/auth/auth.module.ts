import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Bases } from "modules/base/base.entity";
import { BaseService } from "modules/base/bases.service";

import { Users } from "modules/user/user.entity";
import { UsersService } from "modules/user/user.service";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
	imports: [TypeOrmModule.forFeature([Users, Bases]), JwtModule],
	controllers: [AuthController],
	providers: [UsersService, AuthService, BaseService],
})
export class AuthModule {}
