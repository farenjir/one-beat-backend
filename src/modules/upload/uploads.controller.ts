import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common";
import { ApiOkResponse, ApiQuery } from "@nestjs/swagger";

import { Express, Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import { IAppResponse, appResponse } from "utils/response.handle";

import { UploadDto, UploadQueryDto } from "./upload.dto";
import { FileValidationPipe, ValidationQueryPipe } from "./upload.pipe";
import { Upload } from "./upload.entity";
import { UploadTypes } from "./upload.configs";
import { UploadService } from "./uploads.service";

@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// getById
	@ApiOkResponse({ type: Upload })
	@Get("getFile")
	async getFile(@Param("id", ParseIntPipe) id: string): Promise<IAppResponse> {
		const file: Upload = await this.uploadService.findById(id);
		return appResponse(file);
	}
	// getBy Query
	@ApiOkResponse({ type: [Upload] })
	@ApiQuery({
		name: "userId",
		required: false,
		type: Number,
	})
	@ApiQuery({
		name: "type",
		required: false,
		type: String,
	})
	@ApiQuery({
		name: "category",
		required: false,
		type: String,
	})
	@Get("getFileList")
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<IAppResponse> {
		const files: Upload[] = await this.uploadService.findBy(query);
		return appResponse(files);
	}
	// uploadFile images
	@UseInterceptors(
		FileInterceptor(
			"file",
			// {
			// 	storage: diskStorage({
			// 		destination: "./uploads",
			// 		filename: multerFilename,
			// 	}),
			// }
		),
	)
	@Post("image")
	async uploadImageFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Image)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<IAppResponse> {
		const fileCreated: Upload = await this.uploadService.create(body, file, req?.user?.id);
		return appResponse(fileCreated);
	}
	// uploadFile music
	@UseInterceptors(FileInterceptor("file"))
	@Post("music")
	async uploadMusicFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<IAppResponse> {
		const fileCreated: Upload = await this.uploadService.create(body, file, req?.user?.id);
		return appResponse(fileCreated);
	}
	// uploadFile zip file
	@UseInterceptors(FileInterceptor("file"))
	@Post("zipFile")
	async uploadZipFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<IAppResponse> {
		const fileCreated: Upload = await this.uploadService.create(body, file, req?.user?.id);
		return appResponse(fileCreated);
	}
}
