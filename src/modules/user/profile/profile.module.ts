import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GlobalModule } from "global/global.module";

import { Profile } from "./profile.entity";
import { ProfileService } from "./profile.service";

@Module({
	imports: [TypeOrmModule.forFeature([Profile]), GlobalModule],
	providers: [ProfileService],
	exports: [ProfileService],
})
export class ProfileModule {}
