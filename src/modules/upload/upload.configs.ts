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
