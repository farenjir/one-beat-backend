import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiExtraModels, ApiOkResponse, ApiQuery, getSchemaPath } from "@nestjs/swagger";

export interface IClassConstructor<InstanceType = unknown> {
	new (...args: unknown[]): InstanceType;
}
interface IOptions {
	responseIsObject?: boolean;
	useAuth?: boolean;
	query?: object[];
	description?: "";
}

export const SwaggerDocumentaryApi = (
	responseDto: IClassConstructor,
	{ responseIsObject = true, useAuth = true, query = [] }: IOptions = {},
) => {
	const queryArray = query.map(ApiQuery);
	const auth = useAuth ? [ApiCookieAuth()] : [];
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
