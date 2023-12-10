import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { IsOptional } from "class-validator";

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: "" })
	@IsOptional()
	firstName: string;

	@Column({ default: "" })
	@IsOptional()
	lastName: string;

	@Column({ default: "" })
	@IsOptional()
	mobileNumber: string;

	@Column({ default: 12 })
	@IsOptional()
	age: number;

	@Column()
	@IsOptional()
	genderId: number;

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	@IsOptional()
	expertiseIds: number[];

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	@IsOptional()
	skillIds: number[];

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	@IsOptional()
	favoriteIds: number[];
}
