import { Module } from "@nestjs/common";

import { JwtModule } from "@nestjs/jwt";

import { BasesModule } from "modules/base/bases.module";

@Module({
	imports: [JwtModule, BasesModule],
	exports: [JwtModule, BasesModule],
})
export class CommonModule {}
