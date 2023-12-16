import { VersionType } from "./version.enum";

export const versionTypeSchema: Array<object> = [
	{
		name: "type",
		required: true,
		enum: VersionType,
	},
];
