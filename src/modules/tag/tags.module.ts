import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Tags } from "./tag.entity";
import { TagsController } from "./tags.controller";
import { TagsService } from "./tags.service";

@Module({
	imports: [TypeOrmModule.forFeature([Tags]), JwtModule],
	controllers: [TagsController],
	providers: [TagsService],
})
export class TagsModule {}
