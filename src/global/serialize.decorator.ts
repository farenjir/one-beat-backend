import { SetMetadata } from "@nestjs/common";

interface ClassConstructor<T = any> {
	new (...args: any[]): T;
}

export const SerializeKey = "Serialize";

export const Serialize = (dto: ClassConstructor, exclude?: boolean) => SetMetadata(SerializeKey, { dto, exclude });
