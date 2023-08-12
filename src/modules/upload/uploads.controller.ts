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
	UseInterceptors,
} from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiQuery } from "@nestjs/swagger";

import { Express, Request } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

import { Role } from "guards/role/role.enum";
import { Roles } from "guards/role/role.decorator";
import { RolesGuard } from "guards/role.guard";
import { AuthGuard } from "guards/auth.guard";

import { IAppResponse, appResponse } from "utils/response.handle";

import { FileValidationPipe, ValidationQueryPipe } from "./upload.pipe";
import { UploadDto, UploadQueryDto } from "./upload.dto";
import { Upload } from "./upload.entity";
import { UploadTypes } from "./upload.configs";
import { UploadService } from "./uploads.service";

@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// getBy Query
	@ApiCookieAuth()
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
	@Roles(Role.Admin, Role.Editor)
	@UseGuards(AuthGuard, RolesGuard)
	async getFiles(@Query(new ValidationQueryPipe()) query: UploadQueryDto = {}): Promise<IAppResponse> {
		const files: Upload[] = await this.uploadService.findBy(query);
		return appResponse(files);
	}
	// uploadFile images
	@ApiCookieAuth()
	@ApiOkResponse({ type: Upload })
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
	@UseGuards(AuthGuard)
	async uploadImageFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Image)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<IAppResponse> {
		const fileCreated: Upload = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// uploadFile music
	@ApiCookieAuth()
	@ApiOkResponse({ type: Upload })
	@UseInterceptors(FileInterceptor("file"))
	@Post("music")
	@Roles(Role.Admin, Role.Editor, Role.Producer)
	@UseGuards(AuthGuard, RolesGuard)
	async uploadMusicFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<IAppResponse> {
		const fileCreated: Upload = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// uploadFile zip
	@ApiCookieAuth()
	@ApiOkResponse({ type: Upload })
	@UseInterceptors(FileInterceptor("file"))
	@Post("zipFile")
	@Roles(Role.Admin, Role.Editor, Role.Producer)
	@UseGuards(AuthGuard, RolesGuard)
	async uploadZipFile(
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
		@Body() body: UploadDto,
		@Req() req: Request,
	): Promise<IAppResponse> {
		const fileCreated: Upload = await this.uploadService.create(body, file, req?.user);
		return appResponse(fileCreated, "2009");
	}
	// getById
	@ApiCookieAuth()
	@ApiOkResponse({ type: Upload })
	@Get("getFile/:id")
	@UseGuards(AuthGuard)
	async getFile(@Param("id", ParseIntPipe) id: string): Promise<IAppResponse> {
		const file: Upload = await this.uploadService.findById(id);
		return appResponse(file);
	}
	// updateFile
	@ApiCookieAuth()
	@ApiOkResponse({ type: Upload })
	@Patch("updateBy/:id")
	@Roles(Role.Admin, Role.Editor, Role.Producer)
	@UseGuards(AuthGuard, RolesGuard)
	async updateUserById(@Param("id", ParseIntPipe) id: string, @Body() body: UploadDto): Promise<IAppResponse> {
		const updatedUser: Upload = await this.uploadService.updateById(id, body);
		return appResponse(updatedUser, "2010");
	}
	// removeFile
	@ApiCookieAuth()
	@ApiOkResponse({ type: Upload })
	@Delete("deleteBy/:id")
	@Roles(Role.Admin, Role.Editor, Role.Producer)
	@UseGuards(AuthGuard, RolesGuard)
	async deleteFile(@Param("id", ParseIntPipe) id: string): Promise<IAppResponse> {
		const file: Upload = await this.uploadService.removeById(id);
		Object.assign(file, { id });
		return appResponse(file, "2011");
	}
}
