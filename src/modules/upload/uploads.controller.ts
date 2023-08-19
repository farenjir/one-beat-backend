import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Express, Request } from "express";

import { AppGuards, Role } from "guard/guard.decorator";
import { SwaggerDocumentaryApi } from "utils/swagger.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";

import { UploadTypes } from "./upload.configs";
import { FileValidationPipe, ValidationQueryPipe } from "./uploads.pipe";
import { FileUploadConfig } from "./upload.interceptor";
import { UploadDto, UploadQueryDto, UploadResponseDto } from "./upload.dto";
import { UploadService } from "./uploads.service";

@ApiTags("Uploads")
@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// uploadFile images
	@SwaggerDocumentaryApi(UploadResponseDto)
	// @AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("image")
	@Post("image")
	async uploadImageFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Image)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() { user }: Request,
	): Promise<AppResponseDto<UploadResponseDto>> {
		const fileCreated: UploadResponseDto = await this.uploadService.create(body, file, { id: 0 });
		return appResponse(fileCreated, "2009");
	}
	// uploadFile music
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("music")
	@Post("music")
	async uploadMusicFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() { user }: Request,
	): Promise<AppResponseDto<UploadResponseDto>> {
		const fileCreated: UploadResponseDto = await this.uploadService.create(body, file, user);
		return appResponse(fileCreated, "2009");
	}
	// uploadFile zip
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("zipFile")
	@Post("zipFile")
	async uploadZipFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() { user }: Request,
	): Promise<AppResponseDto<UploadResponseDto>> {
		const fileCreated: UploadResponseDto = await this.uploadService.create(body, file, user);
		return appResponse(fileCreated, "2009");
	}
	// getBy Query
	@SwaggerDocumentaryApi(UploadResponseDto, {
		responseIsObject: false,
		query: [
			{
				name: "userId",
				required: false,
				type: Number,
			},
			{
				name: "type",
				required: false,
				type: String,
			},
			{
				name: "category",
				required: false,
				type: String,
			},
		],
	})
	// @AppGuards(Role.Admin, Role.Editor)
	@Get("filesList")
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<AppResponseDto<UploadResponseDto>> {
		const files: UploadResponseDto[] = await this.uploadService.findBy(query);
		return appResponse(files);
	}
	// getById
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards()
	@Get("getBy/:id")
	async getFile(@Param("id", ParseIntPipe) id: string): Promise<AppResponseDto<UploadResponseDto>> {
		const file: UploadResponseDto = await this.uploadService.findById(id);
		return appResponse(file);
	}
	// updateFile
	@SwaggerDocumentaryApi(UploadResponseDto)
	// @AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Patch("updateBy/:id")
	async updateUserById(
		@Param("id", ParseIntPipe) id: string,
		@Body() body: UploadDto,
	): Promise<AppResponseDto<UploadResponseDto>> {
		const updatedUser: UploadResponseDto = await this.uploadService.updateById(id, body);
		return appResponse(updatedUser, "2010");
	}
	// removeFile
	@SwaggerDocumentaryApi(UploadResponseDto)
	// @AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Delete("deleteBy/:id")
	async deleteFile(@Param("id", ParseIntPipe) id: string): Promise<AppResponseDto<UploadResponseDto>> {
		const file: UploadResponseDto = await this.uploadService.removeById(id);
		Object.assign(file, { id });
		return appResponse(file, "2011");
	}
}
