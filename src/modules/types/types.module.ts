import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Types } from "./type.entity";
import { TypesController } from "./types.controller";
import { TypesService } from "./types.service";

@Module({
	imports: [TypeOrmModule.forFeature([Types]), JwtModule],
	controllers: [TypesController],
	providers: [TypesService],
})
export class TypesModule {}
