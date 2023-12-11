import { Body, Controller, Delete, Get, Param, Put, Post, Query, Req, UploadedFile, ParseIntPipe } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Express, Request } from "express";

import { AppGuards, Role } from "global/guards.decorator";
import { SwaggerDocumentaryApi } from "global/swagger.decorator";
import { ResponseMessage } from "global/response.decorator";

import { UploadTypes } from "utils/configs/upload.configs";
import { FileUploadConfig } from "./upload.interceptor";
import { FileValidationPipe, ValidationQueryPipe } from "./uploads.pipe";

import { UploadService } from "./uploads.service";
import { UploadDto, UploadQueryDto, UploadResponseDto } from "./upload.dto";

@ApiTags("Uploads")
@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// uploadFile images
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@FileUploadConfig("image")
	@Post("image")
	@ResponseMessage("2009")
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
	@ResponseMessage("2009")
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
	@ResponseMessage("2009")
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
	@ResponseMessage("2009")
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<UploadResponseDto[]> {
		return await this.uploadService.findBy(query);
	}
	// Streamable File class
	// @Get("getFileBy/:id")
	// @Header("Content-Type", "application/json")
	// @Header("Content-Disposition", "attachment;")
	// async getStaticFile(@Param("id") id: string): Promise<StreamableFile> {
	// 	const { name } = await this.uploadService.findById(id);
	// 	const file = await createReadStreamFile(process.cwd(), name);
	// 	return new StreamableFile(file);
	// }
	// getById
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards()
	@Get("getInfoBy/:id")
	@ResponseMessage("")
	async getFile(@Param("id", ParseIntPipe) id: number): Promise<UploadResponseDto> {
		return await this.uploadService.findById(id);
	}
	// updateFile
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Put("updateBy/:id")
	@ResponseMessage("2010")
	async updateUserById(@Param("id", ParseIntPipe) id: number, @Body() body: UploadDto): Promise<UploadResponseDto> {
		return await this.uploadService.updateById(id, body);
	}
	// removeFile
	@SwaggerDocumentaryApi(UploadResponseDto)
	@AppGuards(Role.Admin, Role.Editor, Role.Producer)
	@Delete("deleteBy/:id")
	@ResponseMessage("2011")
	async deleteFile(@Param("id", ParseIntPipe) id: number): Promise<UploadResponseDto> {
		return await this.uploadService.removeById(id);
	}
}
