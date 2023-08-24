import { UserKYC } from "./kyc/kyc.entity";
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

	@Column({ unique: true })
	username!: string;

	@Column({ unique: true })
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

	// *** relations

	@OneToOne(() => Profile)
	@JoinColumn()
	profile: Profile;

	@OneToOne(() => UserKYC, { eager: true })
	@JoinColumn()
	userKyc: UserKYC;
}
