import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";

import { Bases } from "modules/base/base.entity";

@Entity()
export class Profile {
	@PrimaryGeneratedColumn()
	id: number;

	// relations params
	@ManyToOne(() => Bases)
	@JoinColumn()
	gender: Bases;
}
