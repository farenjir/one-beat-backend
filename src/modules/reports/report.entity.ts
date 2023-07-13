import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../users/user.entity";

@Entity()
export class Report {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ default: false })
	approved: boolean;

	@Column()
	price: number;

	@Column()
	make: string;

	@Column()
	model: string;

	@Column()
	year: number;

	@Column()
	lng: number;

	@Column()
	lat: number;

	@Column()
	mileage: number;

	// *** relations
	@ManyToOne(() => User, (user) => user.reports, {
		// cascade: true, ...
	})
	// @JoinColumn()
	user: User;
}
