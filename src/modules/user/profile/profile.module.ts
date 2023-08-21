import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Bases } from "modules/base/base.entity";
import { BaseService } from "modules/base/bases.service";

import { Users } from "../user.entity";
import { UsersService } from "../user.service";

@Module({
	imports: [TypeOrmModule.forFeature([Users, Bases]), JwtModule],
	providers: [UsersService, BaseService],
})
export class ProfileModule {}
