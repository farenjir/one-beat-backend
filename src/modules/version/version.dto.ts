import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Max, Min } from "class-validator";
import { Expose, Type } from "class-transformer";

import { VersionType } from "./version.enum";

export { VersionDto, VersionCreateUpdateDto, VersionQuery };

class VersionDto {
	@ApiProperty()
	@Expose()
	@IsInt()
	@IsOptional()
	id?: number;
	@ApiProperty({ default: 1 })
	@Expose()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(999)
	appVersion: number;
	@ApiProperty({ default: 1 })
	@Expose()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(999)
	baseVersion: number;
	@ApiProperty({ default: ["FEATURE", "description"] })
	@Expose()
	@IsArray()
	description: string[];
}

class VersionCreateUpdateDto {
	@ApiProperty({ default: ["FEATURE", "description"] })
	@IsArray()
	description?: string[];
}

class VersionQuery {
	@ApiProperty({ name: "type", enum: VersionType, required: false, default: VersionType.Bases })
	@IsOptional()
	type?: VersionType;
}
