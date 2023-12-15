import { ProductLevel, ProductStatus } from "./product.enum";
import { ApiQueryOptions } from "@nestjs/swagger";

export const productQuerySchema: Array<ApiQueryOptions> = [
	{
		name: "id",
		required: false,
		type: Number,
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
		isArray: true,
		type: Number,
	},
	{
		name: "tempoIds",
		required: false,
		isArray: true,
		type: Number,
	},
	{
		name: "groupIds",
		required: false,
		isArray: true,
		type: Number,
	},
	{
		name: "moodIds",
		required: false,
		isArray: true,
		type: Number,
	},
	// relation
	{
		name: "producerId",
		required: false,
		type: Number,
	},
	{
		name: "producerUsername",
		required: false,
		type: String,
	},
	{
		name: "producerEmail",
		required: false,
		type: String,
	},
];
