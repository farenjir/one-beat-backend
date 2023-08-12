// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
export const multerFilename = (_request: any, fileObj: any, cb: any): void => {
	const uploadFilename = path.parse(fileObj.originalname);
	// return new file name
	return cb(null, `${uploadFilename.name}-${Date.now()}${uploadFilename.ext}`);
};

export type ItemUploadType = {
	name: string;
	types: string[];
	maxFileSize: number;
};

export const UploadTypes = {
	Image: { name: "Image", types: ["image/jpeg", "image/jpg", "image/png"], maxFileSize: 5000000 }, // 5mb
	Music: { name: "Music", types: ["mp3", "wave"], maxFileSize: 10000000 }, // 10mb
	Zip: { name: "Zip", types: ["rar", "zip"], maxFileSize: 200000000 }, // 200mb
};

export enum Uploads {
	Image = "image",
	Music = "music",
	Zip = "zip",
}