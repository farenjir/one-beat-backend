import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

import { UploadEnum } from "modules/upload/upload.enum";

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

	@Column({ type: "enum", enum: UploadEnum, default: UploadEnum.Image })
	category: UploadEnum;

	@Column()
	type!: string;

	@Column({ default: "" })
	description?: string;
}
