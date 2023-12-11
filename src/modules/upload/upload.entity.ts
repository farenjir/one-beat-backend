import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { IsOptional } from "class-validator";

import { UploadEnum } from "utils/configs/upload.configs";

abstract class DefaultEntity {
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@DeleteDateColumn()
	deletedAt: Date;
}

@Entity()
export class Upload extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId!: number;

	@Column()
	name!: string;

	@Column({
		type: "enum",
		enum: UploadEnum,
	})
	category!: UploadEnum;

	@Column()
	type!: string;

	@IsOptional()
	@Column({ default: "" })
	description?: string;
}
