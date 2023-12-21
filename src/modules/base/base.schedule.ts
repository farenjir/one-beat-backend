import { Role } from "global/guards.decorator";
import { ProducerLevel } from "modules/user/kyc/kyc.enum";
import { TagType } from "modules/tag/tag.enum";
import { VersionType } from "modules/version/version.enum";
import { BlogLanguages, BlogLevel, BlogStatus } from "modules/blog/blog.enum";
import { ProductLevel, ProductStatus } from "modules/product/product.enum";
import { UploadEnum } from "modules/upload/upload.enum";

export const defaultEnumAndBaseApp = [
	{ type: "Role", children: Role },
	{ type: "ProducerLevel", children: ProducerLevel },
	{ type: "TagType", children: TagType },
	{ type: "VersionType", children: VersionType },
	{ type: "UploadEnum", children: UploadEnum },
	{ type: "BlogStatus", children: BlogStatus },
	{ type: "BlogLanguages", children: BlogLanguages },
	{ type: "BlogLevel", children: BlogLevel },
	{ type: "ProductLevel", children: ProductLevel },
	{ type: "ProductStatus", children: ProductStatus },
];
