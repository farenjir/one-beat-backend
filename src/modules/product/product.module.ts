import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { GlobalModule } from "global/global.module";

import { UsersModule } from "modules/user/user.module";

import { Products } from "./product.entity";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./product.service";

@Module({
	imports: [TypeOrmModule.forFeature([Products]), GlobalModule, UsersModule],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductModule {}
