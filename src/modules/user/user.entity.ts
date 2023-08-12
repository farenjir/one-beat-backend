import {
	AfterInsert,
	AfterRemove,
	AfterUpdate,
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from "typeorm";
import { Role } from "guards/role/role.enum";

abstract class DefaultEntity {
	@CreateDateColumn({ name: "createdAt" })
	createdAt: Date;
	@UpdateDateColumn({ name: "updatedAt" })
	updatedAt: Date;
	@DeleteDateColumn({ name: "deletedAt" })
	deletedAt: Date;
}

@Entity()
export class Users extends DefaultEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
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
	
	// logs
	@AfterInsert()
	logInsert() {
		console.log("Inserted User with id", this.id);
	}
	@AfterUpdate()
	logUpdate() {
		console.log("Updated User with id", this.id);
	}
	@AfterRemove()
	logRemove() {
		console.log("Removed User with id", this.id);
	}
}
