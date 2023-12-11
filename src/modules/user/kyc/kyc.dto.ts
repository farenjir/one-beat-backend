import { IsBoolean, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

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
}
