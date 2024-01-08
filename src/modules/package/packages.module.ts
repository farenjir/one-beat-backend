import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "modules/user/users.module";

import { Packages } from "./package.entity";
import { PackagesController } from "./packages.controller";
import { PackagesService } from "./packages.service";

@Module({
	imports: [TypeOrmModule.forFeature([Packages]), JwtModule, UsersModule],
	controllers: [PackagesController],
	providers: [PackagesService],
})
export class PackageModule {}
