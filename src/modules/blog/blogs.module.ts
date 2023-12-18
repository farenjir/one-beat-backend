import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "modules/user/users.module";

import { Blogs } from "./blog.entity";
import { BlogsController } from "./blogs.controller";
import { BlogServices } from "./blogs.service";

@Module({
	imports: [TypeOrmModule.forFeature([Blogs]), JwtModule, UsersModule],
	controllers: [BlogsController],
	providers: [BlogServices],
})
export class BlogsModule {}
