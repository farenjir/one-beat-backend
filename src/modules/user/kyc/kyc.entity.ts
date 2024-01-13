import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsOptional } from "class-validator";

import { ProducerStatus } from "./kyc.enum";

@Entity()
export class UserKYC {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@IsOptional()
	userKyc: boolean;

	@Column()
	@IsOptional()
	mobileKyc: boolean;

	@Column()
	@IsOptional()
	googleKyc: boolean;

	@Column()
	@IsOptional()
	emailKyc: boolean;

	@Column({
		type: "enum",
		enum: ProducerStatus,
		default: ProducerStatus.NotRequested,
	})
	@IsOptional()
	producerKyc: ProducerStatus;
}
