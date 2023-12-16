import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiExtraModels, ApiOkResponse, ApiOperation, ApiQuery, ApiQueryOptions, getSchemaPath } from "@nestjs/swagger";

export interface Dto<InstanceType = unknown> {
	new (...args: unknown[]): InstanceType;
}

export enum EnumRes {
	Object = "Object",
	Array = "Array",
	ArrayWithCount = "ArrayWithCount",
}
interface IOptions {
	response?: EnumRes;
	useAuth?: boolean;
	query?: Array<ApiQueryOptions>;
	description?: string;
}

export const SwaggerDocumentaryApi = (
	responseDto: Dto,
	{ response = EnumRes.Object, useAuth = true, query = [], description = "" }: IOptions = {},
) => {
	const queryArray = query.map(ApiQuery);
	const auth = useAuth ? [ApiCookieAuth()] : [];
	// result
	const result = (type: EnumRes) => {
		switch (type) {
			case EnumRes.Object:
				return { $ref: getSchemaPath(responseDto) };
			case EnumRes.ArrayWithCount:
				return {
					allOf: [
						{
							properties: {
								total: {
									type: "number",
								},
								data: {
									type: "array",
									items: { $ref: getSchemaPath(responseDto) },
								},
							},
						},
					],
				};
			default:
				return {
					type: "array",
					items: { $ref: getSchemaPath(responseDto) },
				};
		}
	};
	// return
	return applyDecorators(
		...auth,
		...queryArray,
		// ApiProperty({
		// 	description,
		// 	title: description,
		// }),
		ApiOperation({ description }),
		ApiExtraModels(responseDto),
		ApiOkResponse({
			schema: {
				allOf: [
					{
						properties: {
							code: {
								type: "integer",
							},
							message: {
								type: "string",
							},
							description: {
								type: "string",
							},
							timestamp: {
								type: "string",
								format: "date-time",
							},
							result: result(response),
						},
					},
				],
			},
		}),
	);
};
