import { SetMetadata } from "@nestjs/common";
import { IClassConstructor } from "app/app.interceptor";

export const SerializeKey = "SerializeKey";

export const Serialize = (dto: IClassConstructor, exclude?: boolean) => SetMetadata(SerializeKey, { dto, exclude });
