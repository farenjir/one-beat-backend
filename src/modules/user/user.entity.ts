import { AfterInsert, AfterRemove, AfterUpdate, Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "modules/role/role.enum";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;
	@Column()
	email: string;
	@Column()
	password: string;
	@Column("simple-enum", { enum: Role, default: Role.User })
	role?: string;
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
