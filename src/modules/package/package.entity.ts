import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	ManyToOne,
} from "typeorm";

import { Users } from "modules/user/user.entity";
import { PackageLevel, PackageStatus } from "./package.enum";

abstract class DefaultEntity {
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@DeleteDateColumn()
	deletedAt: Date;
}

@Entity()
export class Packages extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	faName: string;

	@Column({ unique: true })
	enName: string;

	@Column()
	faDescription!: string;

	@Column()
	enDescription!: string;

	@Column()
	coverFileName!: string;

	@Column()
	demoFileName!: string;

	@Column("int", { array: true, default: [] })
	genreIds: number[];

	@Column("int", { array: true, default: [] })
	tempoIds: number[];

	@Column("int", { array: true, default: [] })
	groupIds: number[];

	@Column("int", { array: true, default: [] })
	moodIds: number[];

	@Column({ type: "enum", enum: PackageStatus, default: PackageStatus.Inprogress })
	status: PackageStatus;

	@Column({ type: "enum", enum: PackageLevel, default: PackageLevel.Potential })
	level: PackageLevel;

	// *** relations
	@ManyToOne(() => Users, { eager: true })
	@JoinColumn()
	producer: Users;
}
