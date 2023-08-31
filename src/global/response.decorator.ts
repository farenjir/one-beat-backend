import { SetMetadata } from "@nestjs/common";

export const ResponseKey = "ResponseMessage";

export const ResponseMessage = (messageCode: string, descriptionCode?: string) =>
	SetMetadata(ResponseKey, [messageCode || "", descriptionCode || ""]);
