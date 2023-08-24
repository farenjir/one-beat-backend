import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Bases } from "modules/base/base.entity";
import { BaseService } from "modules/base/bases.service";

import { Users } from "../user.entity";
import { UsersService } from "../user.service";

import { Profile } from "../profile/profile.entity";
import { ProfileService } from "../profile/profile.service";

import { UserKycService } from "./kyc.service";
import { UserKYC } from "./kyc.entity";

@Module({
	imports: [TypeOrmModule.forFeature([UserKYC, Users, Profile, Bases]), JwtModule],
	providers: [UserKycService, UsersService, ProfileService, BaseService],
})
export class UserKycModule {}
