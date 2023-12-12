import { ProductLevel, ProductStatus } from "./product.enum";

export interface IFindOneProduct {
	id?: number;
	faName?: string;
	enName?: string;
	status?: ProductStatus;
	level?: ProductLevel;
}
