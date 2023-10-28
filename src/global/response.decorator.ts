import { SetMetadata } from "@nestjs/common";

export const RESPONSE_KEY = "ResponseMessage";

export const ResponseMessage = (messageCode: string, descriptionCode?: string): MethodDecorator & ClassDecorator => {
	return SetMetadata<string, string[]>(RESPONSE_KEY, [messageCode ?? "", descriptionCode ?? ""]);
};
