import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { Users } from "./user.entity";
import { UsersService } from "./user.service";
import { UsersController } from "./users.controller";

@Module({
	imports: [TypeOrmModule.forFeature([Users]), JwtModule],
	controllers: [UsersController],
	providers: [UsersService],
})
export class UsersModule {}
