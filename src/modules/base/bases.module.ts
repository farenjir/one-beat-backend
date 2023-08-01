import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Bases } from "./base.entity";
import { BaseController } from "./bases.controller";
import { BaseService } from "./bases.service";

@Module({
	imports: [TypeOrmModule.forFeature([Bases]), JwtModule],
	controllers: [BaseController],
	providers: [BaseService],
})
export class BasesModule {}
