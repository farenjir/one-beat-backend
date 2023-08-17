import { Type, applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export class AppResponseDto<TData> {
	@ApiProperty()
	code: number;
	@ApiProperty()
	message: string;
	@ApiProperty()
	description: string;
	@ApiProperty()
	timestamp: string;
	@ApiProperty()
	data: TData[] | TData;
}

export const appResponse = <T>(data: T | T[], code = "2000", descriptionCode?: string): AppResponseDto<T> => ({
	code: Number(code),
	message: responseMessage(code),
	description: descriptionMessage(descriptionCode),
	timestamp: new Date().toISOString(),
	data,
});

export const ApiSwaggerResponse = <TModel extends Type>(model: TModel, isObject: boolean = true) => {
	return applyDecorators(
		ApiExtraModels(model),
		ApiOkResponse({
			schema: {
				allOf: [
					{ $ref: getSchemaPath(AppResponseDto) },
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
							data: isObject
								? { $ref: getSchemaPath(model) }
								: {
										type: "array",
										items: { $ref: getSchemaPath(model) },
								  },
						},
					},
				],
			},
		}),
	);
};

const responseMessage = (statusCode: string) => {
	const messages = {
		2000: "Succeed",
		2001: "User Created",
		2002: "User SignIn",
		2003: "User SignUp",
		2004: "User SignOut",
		2005: "User Updated",
		2006: "User Deleted",
		2007: "Base Created",
		2008: "Base Updated",
		2009: "File Uploaded",
		2010: "File Updated",
		2011: "File Deleted",
	};
	// return
	return messages[statusCode];
};

const descriptionMessage = (descriptionCode: string) => {
	const messages = {};
	// return
	return messages[descriptionCode] || "";
};
