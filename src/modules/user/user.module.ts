import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "global/common.module";

import { Profile } from "./profile/profile.entity";
import { ProfileService } from "./profile/profile.service";

import { UserKYC } from "./kyc/kyc.entity";
import { UserKycService } from "./kyc/kyc.service";

import { Users } from "./user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./users.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Users, Profile, UserKYC]), CommonModule],
	controllers: [UsersController],
	providers: [UsersService, ProfileService, UserKycService],
	exports: [UsersService],
})
export class UsersModule {}
