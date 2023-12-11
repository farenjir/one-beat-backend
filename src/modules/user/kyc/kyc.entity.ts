import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsOptional } from "class-validator";

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
}
