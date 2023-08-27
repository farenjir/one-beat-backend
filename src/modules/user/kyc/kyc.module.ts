import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "global/common.module";

import { UsersModule } from "../user.module";

import { UserKycService } from "./kyc.service";
import { UserKYC } from "./kyc.entity";

@Module({
	imports: [TypeOrmModule.forFeature([UserKYC]), UsersModule, CommonModule],
	providers: [UserKycService],
	exports: [UserKycService],
})
export class UserKycModule {}
