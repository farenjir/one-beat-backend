import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { Uploads } from "./upload.enum";
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
	id: number;
	@Column()
	name: string;
	@IsOptional()
	@Column({ default: "" })
	description: string;
	@Column({
		type: "enum",
		enum: Uploads,
	})
	type: Uploads[];
}
