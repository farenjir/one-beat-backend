import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { Express } from "express";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";

import { FileDto } from "./upload.dto";
import { UploadTypes } from "./upload.enum";
import { UploadService } from "./uploads.service";
import { FileValidationPipe } from "./upload.pipe";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
export const multerFilename = (_request: any, fileObj: any, cb: any): void => {
	const uploadFilename = path.parse(fileObj.originalname);
	// return new file name
	return cb(null, `${uploadFilename.name}-${Date.now()}${uploadFilename.ext}`);
};

@ApiTags("Upload")
@Controller("upload")
export class UploadController {
	constructor(private uploadService: UploadService) {}
	// uploadFile images
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./uploads",
				filename: multerFilename,
			}),
		}),
	)
	@Post("image")
	uploadImageFile(
		@Body() body: FileDto,
		@UploadedFile(new FileValidationPipe(UploadTypes.Image)) file: Express.Multer.File,
	) {
		// {
		// 	fieldname: 'file',
		// 	originalname: '1BEAT (2).jpg',
		// 	encoding: '7bit',
		// 	mimetype: 'image/jpeg',
		// 	destination: './uploads',
		// 	filename: '1BEAT (2)-1691794964400.jpg',
		// 	path: 'uploads\\1BEAT (2)-1691794964400.jpg',
		// 	size: 1148691
		//   }
		return {
			body,
		};
	}
	// uploadFile music
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./uploads",
				filename: multerFilename,
			}),
		}),
	)
	@Post("music")
	uploadMusicFile(
		@Body() body: FileDto,
		@UploadedFile(new FileValidationPipe(UploadTypes.Music)) file: Express.Multer.File,
	) {
		return {
			body,
			file: file.buffer.toString(),
		};
	}
	// uploadFile zip file
	@UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: "./uploads",
				filename: multerFilename,
			}),
		}),
	)
	@Post("zipFile")
	uploadZipFile(
		@Body() body: FileDto,
		@UploadedFile(new FileValidationPipe(UploadTypes.Zip)) file: Express.Multer.File,
	) {
		return {
			body,
			file: file?.buffer.toString(),
		};
	}
}
