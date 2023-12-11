import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProducerLevel } from "./kyc.enum";

export { UserKycDto };

// *** params

class UserKycDto {
	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	userKyc?: boolean;

	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	mobileKyc?: boolean;

	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	googleKyc?: boolean;

	@ApiProperty({ default: false })
	@IsBoolean()
	@IsOptional()
	emailKyc?: boolean;

	@ApiProperty({
		name: "producerKyc",
		enum: ProducerLevel,
		default: ProducerLevel.User,
	})
	@IsOptional()
	producerKyc?: ProducerLevel;
}
