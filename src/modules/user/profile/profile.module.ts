import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CommonModule } from "global/common.module";

import { UsersModule } from "../user.module";

import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Module({
	imports: [TypeOrmModule.forFeature([Profile]), UsersModule, CommonModule],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfileModule {}
