import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent } from "typeorm";

@Entity()
@Tree("closure-table")
export class Bases {
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
