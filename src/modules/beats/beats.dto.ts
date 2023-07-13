import { IsBoolean, IsString, IsNumber, IsArray, IsEnum } from "class-validator";
import { Expose, Transform } from "class-transformer";

export { ApproveBeatDto, BeatDto, CreateBeatDto };

class ApproveBeatDto {
	@IsBoolean()
	approved: boolean;
}

class BeatDto {
	@Expose()
	approved: boolean;
	// number
	@Expose()
	id: number;
	@Expose()
	price: number;
	@Expose()
	verses: number;
	@Expose()
	duration: number;
	// string
	@Expose()
	title: string;
	@Expose()
	imageAddress: string;
	@Expose()
	genre: string;
	@Expose()
	producer: string;
	@Expose()
	descriptions: string;
	@Expose()
	createdAt: Date;
	@Expose()
	updatedAt: Date;
	// Array
	@Expose()
	fileIds: string[]
	@Expose()
	qualities: string[]
	@Expose()
	types: string[]
	@Expose()
	moods: string[]
	// *** Transform
	@Transform(({ obj }) => obj.user.id)
	@Expose()
	userId: number;
}

class CreateBeatDto {
	@IsBoolean()
	approved: boolean;
	// string
	@IsString()
	title: string;
	@IsString()
	imageAddress: string;
	@IsString()
	genre: string;
	@IsString()
	producer: string;
	@IsString()
	descriptions: string;
	@Expose()
	createdAt: Date;
	@Expose()
	updatedAt: Date;
	// number
	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	price: number;
	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	verses: number;
	@Transform(({ value }) => parseInt(value))
	@IsNumber()
	duration: number;
	// Array
	@IsEnum({})
	fileIds: string[]
	@IsEnum({})
	qualities: string[]
	@IsEnum({})
	types: string[]
	@IsEnum({})
	moods: string[]
}
