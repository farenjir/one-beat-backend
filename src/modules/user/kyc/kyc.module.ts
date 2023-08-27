import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserKYC } from "./kyc.entity";
import { UserKycService } from "./kyc.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserKYC])],
	providers: [UserKycService],
	exports: [UserKycService],
})
export class UserKycModule {}
