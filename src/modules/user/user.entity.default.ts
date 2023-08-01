import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export default class DefaultEntity {
	@CreateDateColumn({ name: "createdAt" })
	createdAt: Date;

	@UpdateDateColumn({ name: "updatedAt" })
	updatedAt: Date;

	@DeleteDateColumn({ name: "deletedAt" })
	deletedAt: Date;
}
