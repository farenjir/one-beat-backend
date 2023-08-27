import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "global/common.module";

import { UsersModule } from "../user.module";

import { UserKYC } from "./kyc.entity";
import { UserKycService } from "./kyc.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserKYC]), UsersModule, CommonModule],
	providers: [UserKycService],
	exports: [UserKycService],
})
export class UserKycModule {}
