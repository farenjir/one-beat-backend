import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsOptional, Max, Min } from "class-validator";
import { Expose, Type } from "class-transformer";

export { VersionDto, VersionCreateUpdateDto };

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
	@ApiProperty({ default: ["feature", "description"] })
	@Expose()
	@IsArray()
	description: string[];
}

class VersionCreateUpdateDto {
	@ApiProperty({ default: ["feature", "description"] })
	@IsArray()
	description?: string[];
}
