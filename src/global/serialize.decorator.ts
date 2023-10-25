import { SetMetadata } from "@nestjs/common";
import { IClassConstructor } from "app/app.interceptor";

export const SERIALIZE_KEY = "SerializeKey";

export const Serialize = (dto: IClassConstructor, exclude?: boolean) => SetMetadata(SERIALIZE_KEY, { dto, exclude });
