import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
	OneToOne,
} from "typeorm";

import { IsOptional } from "class-validator";

import { Users } from "modules/user/user.entity";
import { Bases } from "modules/base/base.entity";
import { Upload } from "modules/upload/upload.entity";

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
	@IsOptional()
	enName: string;

	@Column()
	faDescription!: string;

	@Column()
	@IsOptional()
	enDescription: string;

	// *** relations
	// @OneToOne(() => ProductKYC, { eager: true })
	// @JoinColumn()
	// kyc: ProductKYC;

	@OneToOne(() => Users, { eager: true })
	@JoinColumn()
	producer: Users;

	@OneToOne(() => Upload, { eager: true })
	@JoinColumn()
	cover: Upload;

	@OneToOne(() => Upload, { eager: true })
	@JoinColumn()
	demo: Upload;

	// *** relations params
	@ManyToOne(() => Bases, { eager: true, nullable: true }) // cascade: ["insert", "update", "recover"],
	@JoinColumn()
	genre: Bases[];

	@ManyToMany(() => Bases, { eager: true, nullable: true })
	@JoinTable()
	tempo: Bases[];

	@ManyToMany(() => Bases, { eager: true, nullable: true })
	@JoinTable()
	group: Bases[];

	@ManyToMany(() => Bases, { eager: true, nullable: true })
	@JoinTable()
	mood: Bases[];

	// *** logging
	// @AfterLoad(){}
	// @BeforeInsert(){}
	// @AfterInsert(){}
	// @BeforeUpdate(){}
	// @AfterUpdate(){}
	// @BeforeRemove(){}
	// @BeforeRemove(){}
}
