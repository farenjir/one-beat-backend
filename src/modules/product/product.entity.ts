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

	@Column({ type: "enum", enum: ProductStatus, default: ProductStatus.Inprogress })
	status: ProductStatus;

	@Column({ type: "enum", enum: ProductLevel, default: ProductLevel.Potential })
	level: ProductLevel;

	// *** relations
	@ManyToOne(() => Users, { eager: true })
	@JoinColumn()
	producer: Users;
}
