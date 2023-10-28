import { SetMetadata } from "@nestjs/common";
import { IClassConstructor } from "app/app.interceptor";

export const SERIALIZE_KEY = "SerializeKey";

export const Serialize = (dto: IClassConstructor, exclude = false): MethodDecorator & ClassDecorator => {
	return SetMetadata(SERIALIZE_KEY, { dto, exclude });
};
