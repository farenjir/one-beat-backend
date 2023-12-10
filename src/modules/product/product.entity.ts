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

import { Users } from "modules/user/user.entity";

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

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	genreIds: number[];

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	tempoIds: number[];

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	groupIds: number[];

	@Column({
		array: true,
		type: Number,
		default: [],
	})
	moodIds: number[];

	// *** relations
	// @OneToOne(() => ProductKYC, { eager: true })
	// @JoinColumn()
	// kyc: ProductKYC;

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
