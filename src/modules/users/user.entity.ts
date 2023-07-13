import {
	AfterInsert,
	AfterRemove,
	AfterUpdate,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
} from "typeorm";
import { Report } from "../reports/report.entity";
import { Beats } from "modules/beats/beats.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	email: string;
	@Column()
	password: string;
	@Column({ default: true })
	admin: boolean;
	// @Column({ default: false })
	// superAdmin: boolean;

	// Report entity
	@OneToMany(() => Report, (report) => report.user, {
		//  nullable: false, eager: true, ...
	})
	reports: Report[];
	// Beats entity
	@OneToMany(() => Beats, (beats) => beats.user)
	beats: Beats[];

	@AfterInsert()
	logInsert() {
		console.log("Inserted User with id", this.id);
	}
	@AfterUpdate()
	logUpdate() {
		console.log("Updated User with id", this.id);
	}
	@AfterRemove()
	logRemove() {
		console.log("Removed User with id", this.id);
	}
}
