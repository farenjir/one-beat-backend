import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Express, Request } from "express";

import { SwaggerDocumentaryApi } from "utils/swagger.decorator";
import { AppResponseDto, appResponse } from "utils/response.filter";

import { AppGuards, Role } from "guard/guard.decorator";

import { UploadTypes } from "./upload.configs";
import { FileValidationPipe, ValidationQueryPipe } from "./uploads.pipe";
import { FileUploadConfig } from "./upload.interceptor";

import { UploadDto, UploadQueryDto, UploadResponse } from "./upload.dto";
import { UploadService } from "./uploads.service";

@ApiTags("Uploads")
@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// uploadFile images
	@SwaggerDocumentaryApi(UploadResponse)
	@FileUploadConfig("image")
	@Post("image")
	// @UseGuards(AuthGuard)
	async uploadImageFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Image)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<AppResponseDto<UploadResponse>> {
		const fileCreated: UploadResponse = await this.uploadService.create(body, file, { id: 0 });
		return appResponse(fileCreated, "2009");
	}
	// uploadFile music
	@SwaggerDocumentaryApi(UploadResponse)
	@FileUploadConfig("music")
	@Post("music")
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	async uploadMusicFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<AppResponseDto<UploadResponse>> {
		const fileCreated: UploadResponse = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// uploadFile zip
	@SwaggerDocumentaryApi(UploadResponse)
	@FileUploadConfig("zipFile")
	@Post("zipFile")
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	async uploadZipFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<AppResponseDto<UploadResponse>> {
		const fileCreated: UploadResponse = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// getBy Query
	@SwaggerDocumentaryApi(UploadResponse, {
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
	@Get("fileList")
	// @AppGuards(Role.Admin, Role.Editor)
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<AppResponseDto<UploadResponse>> {
		const files: UploadResponse[] = await this.uploadService.findBy(query);
		return appResponse(files);
	}
	// getById
	@SwaggerDocumentaryApi(UploadResponse)
	@Get("getBy/:id")
	// @AppGuards()
	async getFile(@Param("id", ParseIntPipe) id: string): Promise<AppResponseDto<UploadResponse>> {
		const file: UploadResponse = await this.uploadService.findById(id);
		return appResponse(file);
	}
	// updateFile
	@SwaggerDocumentaryApi(UploadResponse)
	@Patch("updateBy/:id")
	// @AppGuards(Role.Admin, Role.Editor, Role.Producer)
	async updateUserById(
		@Param("id", ParseIntPipe) id: string,
		@Body() body: UploadDto,
	): Promise<AppResponseDto<UploadResponse>> {
		const updatedUser: UploadResponse = await this.uploadService.updateById(id, body);
		return appResponse(updatedUser, "2010");
	}
	// removeFile
	@SwaggerDocumentaryApi(UploadResponse)
	@Delete("deleteBy/:id")
	// @AppGuards(Role.Admin, Role.Editor, Role.Producer)
	async deleteFile(@Param("id", ParseIntPipe) id: string): Promise<AppResponseDto<UploadResponse>> {
		const file: UploadResponse = await this.uploadService.removeById(id);
		Object.assign(file, { id });
		return appResponse(file, "2011");
	}
}
