import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtModule } from "@nestjs/jwt";

import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Module({
	imports: [TypeOrmModule.forFeature([Profile]), JwtModule],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfileModule {}
