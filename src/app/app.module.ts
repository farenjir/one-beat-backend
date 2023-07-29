import { APP_PIPE } from "@nestjs/core";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { User } from "modules/user/user.entity";
import { UsersModule } from "modules/user/user.module";
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			// expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
				type: "postgres",
				synchronize: true,
				host: config.get<string>("DB_HOST"),
				port: config.get<number>("DB_PORT"),
				username: config.get<string>("DB_USER"),
				password: config.get<string>("DB_PASS"),
				// app entities
				entities: [User],
			}),
		}),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService): JwtModuleOptions => ({
				global: true,
				secret: config.get<string>("JWT_KEY"),
				signOptions: { expiresIn: "1d" },
			}),
		}),
		UsersModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_PIPE,
			useValue: new ValidationPipe({
				whitelist: true,
			}),
		},
	],
})
export class AppModule {}
