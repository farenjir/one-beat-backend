import { TagType } from "./tag.enum";

export const getTagSchema: Array<object> = [
	{
		name: "id",
		required: false,
		type: Number,
	},
	{
		name: "faName",
		required: false,
		type: String,
	},
	{
		name: "enName",
		required: false,
		type: String,
	},
	{
		name: "type",
		required: false,
		enum: TagType,
	},
];
