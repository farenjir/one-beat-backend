import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Version } from "./version.entity";
import { BaseController } from "./versions.controller";
import { BaseService } from "./versions.service";

@Module({
	imports: [TypeOrmModule.forFeature([Version]), JwtModule],
	controllers: [BaseController],
	providers: [BaseService],
})
export class VersionModule {}
