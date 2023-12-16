import { ProductLevel, ProductStatus } from "./product.enum";

export const productPaginationSchema: Array<object> = [
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
];

export const productQuerySchema: Array<object> = [
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
		name: "status",
		required: false,
		enum: ProductStatus,
	},
	{
		name: "level",
		required: false,
		enum: ProductLevel,
	},
	// bases
	{
		name: "genreIds",
		required: false,
		type: [Number],
	},
	{
		name: "tempoIds",
		required: false,
		type: [Number],
	},
	{
		name: "groupIds",
		required: false,
		type: [Number],
	},
	{
		name: "moodIds",
		required: false,
		type: [Number],
	},
	// relation
	{
		name: "producerId",
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
