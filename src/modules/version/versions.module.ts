import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Version } from "./version.entity";
import { VersionController } from "./versions.controller";
import { VersionService } from "./versions.service";

@Module({
	imports: [TypeOrmModule.forFeature([Version]), JwtModule],
	controllers: [VersionController],
	providers: [VersionService],
})
export class VersionModule {}
