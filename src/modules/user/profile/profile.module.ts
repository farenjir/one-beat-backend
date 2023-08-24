import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Bases } from "modules/base/base.entity";
import { BaseService } from "modules/base/bases.service";

import { Users } from "../user.entity";
import { UsersService } from "../user.service";

import { UserKYC } from "../kyc/kyc.entity";
import { UserKycService } from "../kyc/kyc.service";

import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Module({
	imports: [TypeOrmModule.forFeature([Profile, Users, Bases, UserKYC]), JwtModule],
	providers: [ProfileService, UsersService, BaseService, UserKycService],
})
export class ProfileModule {}
