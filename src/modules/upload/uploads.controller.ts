import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	UploadedFile,
	UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Express, Request } from "express";

import { SwaggerDocumentary } from "app/app.decorator";
import { AppResponseDto, appResponse } from "app/response";

import { Role } from "guards/role/role.enum";
import { Roles } from "guards/role/role.decorator";
import { RolesGuard } from "guards/role.guard";
import { AuthGuard } from "guards/auth.guard";

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
	@SwaggerDocumentary({ responseDto: UploadResponse })
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
	@SwaggerDocumentary({ responseDto: UploadResponse })
	@FileUploadConfig("music")
	@Post("music")
	@Roles(Role.Admin, Role.Editor, Role.Producer)
	@UseGuards(AuthGuard, RolesGuard)
	async uploadMusicFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<AppResponseDto<UploadResponse>> {
		const fileCreated: UploadResponse = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// uploadFile zip
	@SwaggerDocumentary({ responseDto: UploadResponse })
	@FileUploadConfig("zipFile")
	@Post("zipFile")
	@Roles(Role.Admin, Role.Editor, Role.Producer)
	@UseGuards(AuthGuard, RolesGuard)
	async uploadZipFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<AppResponseDto<UploadResponse>> {
		const fileCreated: UploadResponse = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// getBy Query
	@SwaggerDocumentary({
		responseDto: UploadResponse,
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
	// @Roles(Role.Admin, Role.Editor)
	// @UseGuards(AuthGuard, RolesGuard)
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<AppResponseDto<UploadResponse>> {
		const files: UploadResponse[] = await this.uploadService.findBy(query);
		return appResponse(files);
	}
	// getById
	@SwaggerDocumentary({ responseDto: UploadResponse })
	@Get("getBy/:id")
	// @UseGuards(AuthGuard)
	async getFile(@Param("id", ParseIntPipe) id: string): Promise<AppResponseDto<UploadResponse>> {
		const file: UploadResponse = await this.uploadService.findById(id);
		return appResponse(file);
	}
	// updateFile
	@SwaggerDocumentary({ responseDto: UploadResponse })
	@Patch("updateBy/:id")
	// @Roles(Role.Admin, Role.Editor, Role.Producer)
	// @UseGuards(AuthGuard, RolesGuard)
	async updateUserById(
		@Param("id", ParseIntPipe) id: string,
		@Body() body: UploadDto,
	): Promise<AppResponseDto<UploadResponse>> {
		const updatedUser: UploadResponse = await this.uploadService.updateById(id, body);
		return appResponse(updatedUser, "2010");
	}
	// removeFile
	@SwaggerDocumentary({ responseDto: UploadResponse })
	@Delete("deleteBy/:id")
	// @Roles(Role.Admin, Role.Editor, Role.Producer)
	// @UseGuards(AuthGuard, RolesGuard)
	async deleteFile(@Param("id", ParseIntPipe) id: string): Promise<AppResponseDto<UploadResponse>> {
		const file: UploadResponse = await this.uploadService.removeById(id);
		Object.assign(file, { id });
		return appResponse(file, "2011");
	}
}
