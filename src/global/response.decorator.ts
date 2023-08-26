import { SetMetadata } from "@nestjs/common";

export const ResponseKey = "ResponseMessage";

export const ResponseMessage = (message: string) => SetMetadata(ResponseKey, message);
