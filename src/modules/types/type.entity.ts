import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent } from "typeorm";
import DefaultEntity from "./type.entity.default";

@Entity()
@Tree("closure-table")
export class Types extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	code: string;
	@Column()
	name: string;
	@Column()
	title: string;
	// TreeChildren
	@TreeChildren()
	children: Types[];
	// TreeParent
	@TreeParent()
	parent: Types;
}
