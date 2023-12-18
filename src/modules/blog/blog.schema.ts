import { BlogLanguages, BlogLevel, BlogStatus } from "./blog.enum";

export const blogQuerySchema: Array<object> = [
	{
		name: "page",
		required: false,
		type: Number,
	},
	{
		name: "take",
		required: false,
		type: Number,
	},
	{
		name: "id",
		required: false,
		type: Number,
	},
	{
		name: "faTitle",
		required: false,
		type: String,
	},
	{
		name: "enTitle",
		required: false,
		type: String,
	},
	// enum
	{
		name: "status",
		required: false,
		enum: BlogStatus,
	},
	{
		name: "level",
		required: false,
		enum: BlogLevel,
	},
	{
		name: "language",
		required: false,
		type: [String],
		description: "languages includes ('fa' or 'en') of (BlogLanguages)",
	},
	// tags
	{
		name: "tags",
		required: false,
		type: [Number],
	},
	// bases
	{
		name: "groupIds",
		required: false,
		type: [Number],
	},
	// relation
	{
		name: "authorId",
		required: false,
		type: Number,
	},
	{
		name: "username",
		required: false,
		type: String,
	},
	{
		name: "email",
		required: false,
		type: String,
	},
];
