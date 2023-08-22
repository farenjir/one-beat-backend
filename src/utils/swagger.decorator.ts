import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from "@nestjs/swagger";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}
interface IOptions {
	responseIsObject?: boolean;
	useAuth?: boolean;
	query?: object[];
	description?: "";
}

export const SwaggerDocumentaryApi = (
	responseDto: ClassConstructor,
	{ responseIsObject = true, useAuth = true, query = [], description = "" }: IOptions = {},
) => {
	let queryArray = [];
	let auth = [];
	if (query?.length) {
		queryArray = query.map(ApiQuery);
	}
	if (useAuth) {
		auth = [ApiCookieAuth()];
	}
	// return
	return applyDecorators(
		...auth,
		...queryArray,
		// ApiProperty({
		// 	description,
		// 	title: description,
		// }),
		ApiExtraModels(responseDto),
		ApiOkResponse({
			schema: {
				allOf: [
					// { $ref: getSchemaPath(AppResponseDto) },
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
							result: responseIsObject
								? { $ref: getSchemaPath(responseDto) }
								: {
										type: "array",
										items: { $ref: getSchemaPath(responseDto) },
								  },
						},
					},
				],
			},
		}),
	);
};
