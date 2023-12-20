import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { VersionModule } from "modules/version/versions.module";

import { Bases } from "./base.entity";
import { BaseController } from "./bases.controller";
import { BaseService } from "./bases.service";

@Module({
	imports: [TypeOrmModule.forFeature([Bases]), JwtModule, VersionModule],
	controllers: [BaseController],
	providers: [BaseService],
	exports: [BaseService],
})
export class BasesModule {}
