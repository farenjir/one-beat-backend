import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";

import { User } from "../users/user.entity";

@Entity()
export class Beats {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false })
	approved: boolean;

	@Column()
	title: string;

	@Column()
	imageAddress: string;

	@Column()
	price: number;

	@Column()
	genre: string;

	@Column()
	producer: string;

	@Column()
	descriptions: string;

	@Column()
	verses: number;

	@Column()
	duration: number;

	@Column({ type: "simple-array" })
	qualities: string[];

	@Column({ type: "simple-array" })
	fileIds: string[];

	@Column({ type: "simple-array" })
	types: string[];

	@Column({ type: "simple-array" })
	moods: string[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	// *** relations
	@ManyToOne(() => User, (user) => user.beats)
	user: User;
}
