import { SetMetadata } from "@nestjs/common";

export const RESPONSE_KEY = "ResponseMessage";

export const ResponseMessage = (messageCode: string, descriptionCode?: string) =>
	SetMetadata(RESPONSE_KEY, [messageCode || "", descriptionCode || ""]);
