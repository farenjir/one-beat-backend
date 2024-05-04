import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsOptional } from "class-validator";

import { ProducerStatus } from "./kyc.enum";

@Entity()
export class UserKYC {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false })
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
		enum: ProducerStatus,
		default: ProducerStatus.NotRequested,
	})
	@IsOptional()
	producerKyc: ProducerStatus;
}
