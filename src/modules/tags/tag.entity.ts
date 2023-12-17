import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { TagType } from "./tag.enum";

@Entity()
export class Tags {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	faName!: string;

	@Column({ unique: true })
	enName!: string;

	@Column({
		type: "enum",
		enum: TagType,
		default: TagType.Blog,
	})
	type!: TagType;
}
