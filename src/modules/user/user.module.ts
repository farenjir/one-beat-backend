import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Users } from "./user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./users.controller";
import { ProfileModule } from "./profile/profile.module";
import { UserKycModule } from "./kyc/kyc.module";

@Module({
	imports: [TypeOrmModule.forFeature([Users]), JwtModule, ProfileModule, UserKycModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
