import {
	Entity,
	Tree,
	Column,
	PrimaryGeneratedColumn,
	TreeChildren,
	TreeParent,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from "typeorm";

export abstract class DefaultEntity {
	@CreateDateColumn()
	createdAt?: Date;
	@UpdateDateColumn()
	updatedAt?: Date;
	@DeleteDateColumn()
	deletedAt?: Date;
}

@Entity()
@Tree("closure-table")
export class Bases extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	type!: string;

	@Column()
	name!: string;

	@Column()
	nameFa!: string;
	
	// TreeChildren
	@TreeChildren()
	children: Bases[];
	// TreeParent
	@TreeParent()
	parent: Bases;
}
