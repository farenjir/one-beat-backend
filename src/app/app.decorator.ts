import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiQuery } from "@nestjs/swagger";

import { ApiSwaggerResponse } from "./response";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}
interface IOptions {
	responseIsObject?: boolean;
	useAuth?: boolean;
	query?: object[];
	description?: "";
}

export const SwaggerDocumentary = (
	responseDto: ClassConstructor,
	{ responseIsObject = true, useAuth = true, query = [], description = "" }: IOptions = {},
) => {
	let queryArray = [];
	let auth = [];
	if (query?.length) {
		queryArray = query.map((queryItem: object) => ApiQuery(queryItem));
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
		ApiSwaggerResponse(responseDto, responseIsObject),
	);
};
