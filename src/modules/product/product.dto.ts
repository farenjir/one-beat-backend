import { ApiProperty } from "@nestjs/swagger";
import { IsArray, MaxLength, MinLength } from "class-validator";
import { Expose } from "class-transformer";
import { Upload } from "modules/upload/upload.entity";
import { Users } from "modules/user/user.entity";
import { Bases } from "modules/base/base.entity";

export { ProductDto };

class ProductDto {
	@ApiProperty()
	@Expose()
	id: string;
	@ApiProperty({ default: "faName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	faName: string;
	@ApiProperty({ default: "enName" })
	@Expose()
	@MaxLength(30)
	@MinLength(1)
	enName: string;
	@ApiProperty({ default: "faDescription" })
	@Expose()
	@MaxLength(300)
	@MinLength(30)
	faDescription: string;
	@ApiProperty({ default: "enDescription" })
	@Expose()
	@MaxLength(300)
	@MinLength(30)
	enDescription: string;
	// relations
	@Expose()
	producer?: Users;
	@Expose()
	cover: Upload;
	@Expose()
	demo: Upload;
	// base relations
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	genre: Bases[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	tempo: Bases[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	group: Bases[];
	@ApiProperty({ type: [Number], default: [] })
	@IsArray()
	@Expose()
	mood: Bases[];
	// defaults
	@Expose()
	createdAt: Date;
	@Expose()
	updatedAt: Date;
	@Expose()
	deletedAt: Date;
}
