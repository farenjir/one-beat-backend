import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column, ManyToMany, JoinTable } from "typeorm";

import { Bases } from "modules/base/base.entity";
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

	// *** relations params

	@ManyToOne(() => Bases, { eager: true, nullable: true }) //cascade: ["insert", "update", "recover"], 
	@JoinColumn()
	gender: Bases;

	@ManyToMany(() => Bases, { eager: true, nullable: true })
	@JoinTable()
	@IsOptional()
	expertise: Bases[] 

	@ManyToMany(() => Bases, { eager: true,  nullable: true })
	@JoinTable()
	@IsOptional()
	skills: Bases[] 

	@ManyToMany(() => Bases, { eager: true, nullable: true })
	@JoinTable()
	@IsOptional()
	favorites: Bases[] 
}