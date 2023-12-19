import { ApiProperty } from "@nestjs/swagger";

import { IsOptional } from "class-validator";

import { ProducerLevel } from "./kyc.enum";

export { UserKycDto };

// *** params

class UserKycDto {
	@ApiProperty({ type: Boolean, required: false })
	@IsOptional()
	userKyc?: boolean;

	@ApiProperty({ type: Boolean, required: false })
	@IsOptional()
	mobileKyc?: boolean;

	@ApiProperty({ type: Boolean, required: false })
	@IsOptional()
	googleKyc?: boolean;

	@ApiProperty({ type: Boolean, required: false })
	@IsOptional()
	emailKyc?: boolean;

	@ApiProperty({ name: "producerKyc", enum: ProducerLevel, required: false })
	@IsOptional()
	producerKyc?: ProducerLevel;
}
