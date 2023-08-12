import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Uploads } from "./upload.configs";
import { IsOptional } from "class-validator";

abstract class DefaultEntity {
	@CreateDateColumn({ name: "createdAt" })
	createdAt: Date;
	@UpdateDateColumn({ name: "updatedAt" })
	updatedAt: Date;
	@DeleteDateColumn({ name: "deletedAt" })
	deletedAt: Date;
}

@Entity()
export class Upload extends DefaultEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId!: number;

	@Column()
	name!: string;

	@Column({
		type: "enum",
		enum: Uploads,
	})
	category!: Uploads;

	@Column()
	type!: string;
	
	@IsOptional()
	@Column({ default: "" })
	description: string;
}
