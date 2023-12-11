import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsOptional } from "class-validator";

import { ProducerLevel } from "./kyc.enum";

@Entity()
export class UserKYC {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: true })
	@IsOptional()
	userKyc: boolean;

	@Column({ default: false })
	@IsOptional()
	mobileKyc: boolean;

	@Column({ default: false })
	@IsOptional()
	googleKyc: boolean;

	@Column({ default: false })
	@IsOptional()
	emailKyc: boolean;

	@Column({
		type: "enum",
		enum: ProducerLevel,
		default: ProducerLevel.User,
	})
	@IsOptional()
	producerKyc: ProducerLevel;
}
