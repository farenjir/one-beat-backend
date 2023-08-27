import { APP_PIPE, APP_INTERCEPTOR, APP_FILTER } from "@nestjs/core";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { CacheModule } from "@nestjs/cache-manager";
import { ScheduleModule } from "@nestjs/schedule";

import { CustomDBLoggerOnTypeORM } from "utils/db.logger";
import { AppExceptionsFilter } from "utils/exception.filter";

import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import {
	AppLoggingInterceptor,
	AppResponseInterceptor,
	HttpCacheInterceptor,
	SerializeInterceptor,
	TimeoutInterceptor,
} from "./app.interceptor";

import { Bases } from "modules/base/base.entity";
import { BasesModule } from "modules/base/bases.module";

import { Version } from "modules/version/version.entity";
import { VersionModule } from "modules/version/versions.module";

import { AuthModule } from "modules/auth/auth.module";
import { UsersModule } from "modules/user/user.module";
import { Users } from "modules/user/user.entity";
import { Profile } from "modules/user/profile/profile.entity";
import { UserKYC } from "modules/user/kyc/kyc.entity";

import { Upload } from "modules/upload/upload.entity";
import { UploadModule } from "modules/upload/uploads.module";

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
				host: config.get<string>("DB_HOST"),
				port: +config.get<number>("DB_PORT"),
				username: config.get<string>("DB_USER"),
				password: config.get<string>("DB_PASS"),
				synchronize: true,
				// autoLoadEntities: true,
				logger: new CustomDBLoggerOnTypeORM(),
				// app entities
				entities: [Bases, Version, Users, Profile, UserKYC, Upload],
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
		CacheModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				ttl: +config.get<number>("CACHE_TTL"),
				max: +config.get<number>("CACHE_MAX"),
			}),
		}),
		// MulterModule.registerAsync({
		// 	inject: [ConfigService],
		// 	useFactory: (config: ConfigService) => ({
		// 		storage: diskStorage({
		// 			destination: config.get<string>("FILE_DEST"),
		// 			filename: multerFilename,
		// 		}),
		// 	}),
		// }),
		ScheduleModule.forRoot(),
		// app modules
		BasesModule,
		VersionModule,
		AuthModule,
		UsersModule,
		UploadModule,
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
		{
			provide: APP_FILTER,
			useClass: AppExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AppLoggingInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: AppResponseInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: SerializeInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: HttpCacheInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: TimeoutInterceptor,
		},
	],
})
export class AppModule {}
