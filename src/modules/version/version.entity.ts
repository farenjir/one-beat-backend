import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Version {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	appVersion!: number;

	@Column()
	baseVersion!: number;

	@Column("text", { array: true, default: [] })
	description!: string[];
}
