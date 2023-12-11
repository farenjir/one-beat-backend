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

import { IsOptional } from "class-validator";

import { Role } from "global/guards.decorator";

import { Users } from "modules/user/user.entity";
import { ProductLevel, ProductStatus } from "./product.enum";

abstract class DefaultEntity {
	@CreateDateColumn()
	createdAt: Date;
	@UpdateDateColumn()
	updatedAt: Date;
	@DeleteDateColumn()
	deletedAt: Date;
}

@Entity()
export class Products extends DefaultEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ unique: true })
	faName!: string;

	@Column({ unique: true })
	enName: string;

	@Column()
	faDescription!: string;

	@Column()
	enDescription: string;

	@Column()
	coverFileName: string;

	@Column()
	demoFileName: string;

	@Column("int", { array: true, default: [] })
	genreIds: number[];

	@Column("int", { array: true, default: [] })
	tempoIds: number[];

	@Column("int", { array: true, default: [] })
	groupIds: number[];

	@Column("int", { array: true, default: [] })
	moodIds: number[];

	@Column({
		type: "enum",
		enum: ProductStatus,
		default: ProductStatus.Inprogress,
	})
	@IsOptional({
		groups: [Role.Admin, Role.Editor],
	})
	status: ProductStatus;

	@Column({
		type: "enum",
		enum: ProductLevel,
		default: ProductLevel.Potential,
	})
	@IsOptional({
		groups: [Role.Admin, Role.Editor],
	})
	level: ProductLevel;

	// *** relations

	@OneToOne(() => Users, { eager: true })
	@JoinColumn()
	producer: Users;

	// *** logging
	// @AfterLoad(){}
	// @BeforeInsert(){}
	// @AfterInsert(){}
	// @BeforeUpdate(){}
	// @AfterUpdate(){}
	// @BeforeRemove(){}
	// @BeforeRemove(){}
}
