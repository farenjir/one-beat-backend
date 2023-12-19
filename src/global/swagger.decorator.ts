import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiExtraModels, ApiOkResponse, ApiOperation, getSchemaPath } from "@nestjs/swagger";

export interface Dto<InstanceType = unknown> {
	new (...args: unknown[]): InstanceType;
}

export enum ResEnum {
	Object = "Object",
	Array = "Array",
	ArrayWithCount = "ArrayWithCount",
}
interface IOptions {
	response?: ResEnum;
	useAuth?: boolean;
	description?: string;
}

export const SwaggerDocumentaryApi = (
	responseDto: Dto,
	{ response = ResEnum.Object, useAuth = true, description = "" }: IOptions = {},
) => {
	const auth = useAuth ? [ApiCookieAuth()] : [];
	// result
	const result = (type: ResEnum) => {
		switch (type) {
			case ResEnum.Array:
				return {
					type: "array",
					items: { $ref: getSchemaPath(responseDto) },
				};
			case ResEnum.ArrayWithCount:
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
				return { $ref: getSchemaPath(responseDto) };
		}
	};
	// return
	return applyDecorators(
		...auth,
		// ApiQuery()
		// ApiProperty(),
		// ApiBody(),
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
