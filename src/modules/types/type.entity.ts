import { Entity, Tree, Column, PrimaryGeneratedColumn, TreeChildren, TreeParent } from "typeorm";
import DefaultEntity from "./type.entity.default";

@Entity()
@Tree("materialized-path")
export class Types extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	code: string;
	@Column()
	name: string;
	@Column()
	title: string;
	// TreeParent
	@TreeParent()
	parent: Types;
	// TreeChildren
	@TreeChildren()
	children: Types[];
}
