import { SetMetadata } from "@nestjs/common";

import { EnumRes } from "./swagger.decorator";

export const RESPONSE_KEY = "ResponseMessage";

export const ResponseMessage = (messageCode: string, descriptionCode?: string, type?: EnumRes): MethodDecorator & ClassDecorator => {
	return SetMetadata<string, string[]>(RESPONSE_KEY, [messageCode ?? "", descriptionCode ?? "", type ?? ""]);
};
