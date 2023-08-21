import {
	AfterInsert,
	AfterRemove,
	AfterUpdate,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	ManyToOne,
} from "typeorm";

import { Role } from "guards/guards.decorator";

import { Profile } from "./profile/profile.entity";

abstract class DefaultEntity {
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@DeleteDateColumn()
	deletedAt: Date;
}

@Entity()
export class Users extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email!: string;

	@Column()
	password!: string;

	@Column({
		array: true,
		type: "enum",
		enum: Role,
		default: [Role.User],
	})
	roles!: Role[];

	// relations
	@ManyToOne(() => Profile)
	@JoinColumn()
	profile!: Profile;

	// logs
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
