import { SetMetadata } from "@nestjs/common";

export const ResponseKey = "ResponseMessage";

export const AppResponse = (message: string) => SetMetadata(ResponseKey, message);
