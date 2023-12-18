import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	OneToMany,
	ManyToOne,
} from "typeorm";
import { IsOptional } from "class-validator";

import { Tags } from "modules/tags/tag.entity";

import { BlogLanguages, BlogLevel, BlogStatus } from "./blog.enum";
import { Users } from "modules/user/user.entity";

abstract class DefaultEntity {
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@DeleteDateColumn()
	deletedAt: Date;
}

@Entity()
export class Blogs extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	faTitle: string;

	@Column({ unique: true })
	enTitle: string;

	@Column()
	faContent!: string;

	@Column()
	enContent!: string;

	@Column()
	coverFileName!: string;

	@Column("int", { array: true, default: [] })
	groupIds: number[];

	@Column({
		array: true,
		type: "enum",
		enum: BlogLanguages,
		default: [BlogLanguages.Farsi],
	})
	@IsOptional()
	language: BlogLanguages[];

	@Column({
		type: "enum",
		enum: BlogStatus,
		default: BlogStatus.Inprogress,
	})
	@IsOptional()
	status: BlogStatus;

	@Column({
		type: "enum",
		enum: BlogLevel,
		default: BlogLevel.Potential,
	})
	@IsOptional()
	level: BlogLevel;

	// *** relations
	@ManyToOne(() => Users, { eager: true })
	@JoinColumn()
	author: Users;

	@OneToMany(() => Tags, (tag) => tag.id, { eager: true })
	@JoinColumn()
	tags: Tags[];
}
