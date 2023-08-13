import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";

import { diskStorage } from "multer";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
export const multerFilename = (_request: any, fileObj: any, cb: any): void => {
	const uploadFilename = path.parse(fileObj.originalname);
	// return new file name
	return cb(null, `${uploadFilename.name}-${Date.now()}${uploadFilename.ext}`);
};

export function FileUploadConfig(folderName: string): ReturnType<typeof UseInterceptors> {
	return UseInterceptors(
		FileInterceptor("file", {
			storage: diskStorage({
				destination: `./uploads/${folderName}`,
				filename: multerFilename,
			}),
		}),
	);
}
