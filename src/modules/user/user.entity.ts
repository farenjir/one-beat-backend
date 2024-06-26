import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	OneToOne,
} from "typeorm";

import { Role } from "global/guards.decorator";

import { UserKYC } from "./kyc/kyc.entity";
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

	@Column({ unique: true })
	username!: string;

	@Column({ unique: true })
	email!: string;

	@Column({ nullable: true })
	password: string;

	@Column({ type: "enum", enum: Role, default: Role.User })
	role: Role;

	// *** relations
	@OneToOne(() => UserKYC, { eager: true })
	@JoinColumn()
	kyc: UserKYC;

	@OneToOne(() => Profile)
	@JoinColumn()
	profile: Profile;

	// *** logging
	// @AfterLoad(){}
	// @BeforeInsert(){}
	// @AfterInsert(){}
	// @BeforeUpdate(){}
	// @AfterUpdate(){}
	// @BeforeRemove(){}
	// @BeforeRemove(){}
}
