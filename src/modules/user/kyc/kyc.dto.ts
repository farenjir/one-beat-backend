import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ProducerLevel } from "./kyc.enum";

export { UserKycDto };

// *** params

class UserKycDto {
	@ApiProperty({ type: Boolean, required: false })
	@IsBoolean()
	@IsOptional()
	userKyc?: boolean;

	@ApiProperty({ type: Boolean, required: false })
	@IsBoolean()
	@IsOptional()
	mobileKyc?: boolean;

	@ApiProperty({ type: Boolean, required: false })
	@IsBoolean()
	@IsOptional()
	googleKyc?: boolean;

	@ApiProperty({ type: Boolean, required: false })
	@IsBoolean()
	@IsOptional()
	emailKyc?: boolean;

	@ApiProperty({
		name: "producerKyc",
		enum: ProducerLevel,
		default: ProducerLevel.NotRequested,
		required: false,
	})
	@IsOptional()
	producerKyc?: ProducerLevel;
}
