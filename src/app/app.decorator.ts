import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiQuery } from "@nestjs/swagger";

import { ApiSwaggerResponse } from "./response";

export const SwaggerDocumentary = ({ responseDto, responseIsObject = true, useAuth = true, query = [], description = "" }) => {
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
