import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GlobalModule } from "global/global.module";

import { Users } from "./user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./users.controller";
import { ProfileModule } from "./profile/profile.module";
import { UserKycModule } from "./kyc/kyc.module";

@Module({
	imports: [TypeOrmModule.forFeature([Users]), ProfileModule, UserKycModule, GlobalModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
