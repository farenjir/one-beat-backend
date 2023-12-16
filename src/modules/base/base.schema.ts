export const getBaseSchema: Array<object> = [
	{
		name: "baseType",
		required: false,
		type: String,
	},
	{
		name: "baseId",
		required: false,
		type: Number,
	},
];

export const getChildrenSchema: Array<object> = [
	{
		name: "parentType",
		required: false,
		type: String,
	},
	{
		name: "parentId",
		required: false,
		type: Number,
	},
];

export const addDescription = "Create a new Base with ( parentId : 0 ) and Create a new Child with ( target Base parentId )";
