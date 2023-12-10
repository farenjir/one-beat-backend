import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "modules/user/user.module";

import { Upload } from "./upload.entity";
import { UploadController } from "./uploads.controller";
import { UploadService } from "./uploads.service";

@Module({
	imports: [TypeOrmModule.forFeature([Upload]), JwtModule, UsersModule],
	controllers: [UploadController],
	providers: [UploadService],
})
export class UploadModule {}
