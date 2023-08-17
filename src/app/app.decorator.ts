import { applyDecorators } from "@nestjs/common";
import { ApiCookieAuth, ApiQuery } from "@nestjs/swagger";

import { ApiSwaggerResponse } from "./response";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

export const SwaggerDocumentary = (
	dto: ClassConstructor<any>,
	responseIsObject: boolean = true,
	useAuth: boolean = true,
	query?: object[] | null,
) => {
	let queryArray = [];
	let auth = [];
	if (query) {
		queryArray = query.map((queryItem: object) => ApiQuery(queryItem));
	}
	if (useAuth) {
		auth = [ApiCookieAuth()];
	}
	// return
	return applyDecorators(...auth, ...queryArray, ApiSwaggerResponse(dto, responseIsObject));
};
