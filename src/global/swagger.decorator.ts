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

export const SwaggerDocumentaryApi = (dto: Dto, { response = ResEnum.Object, useAuth = true, description = "" }: IOptions = {}) => {
	const auth = useAuth ? [ApiCookieAuth()] : [];
	// result
	const result = (type: ResEnum) => {
		switch (type) {
			case ResEnum.Array:
				return {
					type: "array",
					items: { $ref: getSchemaPath(dto) },
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
									items: { $ref: getSchemaPath(dto) },
								},
							},
						},
					],
				};
			default:
				return { $ref: getSchemaPath(dto) };
		}
	};
	// return
	return applyDecorators(
		...auth,
		// ApiQuery()
		// ApiProperty(),
		// ApiBody(),
		ApiOperation({ description }),
		ApiExtraModels(dto),
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
