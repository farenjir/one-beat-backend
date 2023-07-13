import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Beats } from "./beats.entity";
import { BeatsController } from "./beats.controller";
import { BeatsService } from "./beats.service";

@Module({
	imports: [TypeOrmModule.forFeature([Beats])],
	controllers: [BeatsController],
	providers: [BeatsService],
})
export class BeatsModule {}
