import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "global/global.module";

import { Upload } from "./upload.entity";
import { UploadController } from "./uploads.controller";
import { UploadService } from "./uploads.service";

@Module({
	imports: [TypeOrmModule.forFeature([Upload]), CommonModule],
	controllers: [UploadController],
	providers: [UploadService],
})
export class UploadModule {}
