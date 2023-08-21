import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Bases } from "modules/base/base.entity";
import { BaseService } from "modules/base/bases.service";

import { Profile } from "./profile/profile.entity";
import { ProfileService } from "./profile/profile.service";

import { Users } from "./user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./users.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Users, Bases, Profile]), JwtModule],
	controllers: [UsersController],
	providers: [UsersService, BaseService, ProfileService],
})
export class UsersModule {}
