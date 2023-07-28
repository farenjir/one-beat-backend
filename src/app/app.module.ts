import { APP_PIPE } from "@nestjs/core";
import { Module, ValidationPipe } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { User } from "modules/user/user.entity";
import { UsersModule } from "modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${process.env.NODE_ENV}`,
			// load: [ormConfig]
			// expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: "sqlite",
					database: config.get<string>("DB_NAME"),
					// host
					// port
					// username
					// password
					synchronize: true,
					entities: [User],
				};
			},
		}),
		JwtModule.register({
			global: true,
			secret: "process.env.JWT_KEY",
			signOptions: { expiresIn: "1d" },
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
