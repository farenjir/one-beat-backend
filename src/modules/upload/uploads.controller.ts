import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UploadedFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Express, Request } from "express";

import { AppGuards, Role } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";

import { UploadTypes } from "./upload.configs";
import { FileUploadConfig } from "./upload.interceptor";
import { FileValidationPipe, ValidationQueryPipe } from "./uploads.pipe";

import { UploadService } from "./uploads.service";
import { UploadDto, UploadQueryDto, UploadResponseDto } from "./upload.dto";
import { AppResponse } from "global/response.decorator";

@ApiTags("Uploads")
@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// uploadFile images
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("image")
	@Post("image")
	@AppResponse("2009")
	async uploadImageFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Image)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() { user }: Request,
	): Promise<UploadResponseDto> {
		return await this.uploadService.create(body, file, user);
	}
	// uploadFile music
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("music")
	@Post("music")
	@AppResponse("2009")
	async uploadMusicFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() { user }: Request,
	): Promise<UploadResponseDto> {
		return await this.uploadService.create(body, file, user);
	}
	// uploadFile zip
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("zipFile")
	@Post("zipFile")
	@AppResponse("2009")
	async uploadZipFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() { user }: Request,
	): Promise<UploadResponseDto> {
		return await this.uploadService.create(body, file, user);
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
	@AppGuards(Role.Admin, Role.Editor)
	@Get("filesList")
	@AppResponse("2009")
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<UploadResponseDto[]> {
		return await this.uploadService.findBy(query);
	}
	// getById
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards()
	@Get("getBy/:id")
	@AppResponse("")
	async getFile(@Param("id", ParseIntPipe) id: string): Promise<UploadResponseDto> {
		return await this.uploadService.findById(id);
	}
	// updateFile
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Patch("updateBy/:id")
	@AppResponse("2010")
	async updateUserById(@Param("id", ParseIntPipe) id: string, @Body() body: UploadDto): Promise<UploadResponseDto> {
		return await this.uploadService.updateById(id, body);
	}
	// removeFile
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Delete("deleteBy/:id")
	@AppResponse("2011")
	async deleteFile(@Param("id", ParseIntPipe) id: string): Promise<UploadResponseDto> {
		return await this.uploadService.removeById(id);
	}
}
