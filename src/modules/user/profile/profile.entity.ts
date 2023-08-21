import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, Column } from "typeorm";

import { Bases } from "modules/base/base.entity";
import { IsOptional } from "class-validator";

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: "" })
	@IsOptional()
	firstName?: string;

	@Column({ default: "" })
	@IsOptional()
	lastName?: string;

	@Column({ default: "" })
	@IsOptional()
	mobileNumber?: string;

	@Column({ default: "" })
	@IsOptional()
	age?: number;

	// *** relations params

	@ManyToOne(() => Bases, { eager: true })
	@JoinColumn()
	@IsOptional()
	gender?: Bases;

	@ManyToOne(() => Bases, { eager: true })
	@JoinColumn()
	@IsOptional()
	skills?: Bases[];

	@ManyToOne(() => Bases, { eager: true })
	@JoinColumn()
	@IsOptional()
	expertise?: Bases[];

	@ManyToOne(() => Bases, { eager: true })
	@JoinColumn()
	@IsOptional()
	favorites?: Bases[];
}
