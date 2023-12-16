import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JwtModule } from "@nestjs/jwt";

import { UsersModule } from "modules/user/users.module";

import { Products } from "./product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";

@Module({
	imports: [TypeOrmModule.forFeature([Products]), JwtModule, UsersModule],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductModule {}
