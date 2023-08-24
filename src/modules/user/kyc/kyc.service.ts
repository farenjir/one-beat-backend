import { Injectable, NotFoundException } from "@nestjs/common";
import { FindOneOptions, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { UserKYC } from "./kyc.entity";
import { UserKycDto } from "./kyc.dto";

@Injectable()
export class UserKycService {
	constructor(@InjectRepository(UserKYC) private repo: Repository<UserKYC>) {}
	// create
	async create({ userKyc, mobileKyc = false, emailKyc = false, producerKyc = false }: UserKycDto): Promise<UserKYC> {
		// create
		const kyc = this.repo.create({ userKyc, mobileKyc, emailKyc, producerKyc });
		return this.repo.save(kyc);
	}
	// findAll
	async find(): Promise<UserKYC[]> {
		return await this.repo.find();
	}
	// findOne
	async findById(kycId: number, isValidKyc: boolean = false): Promise<UserKYC> {
		const options: FindOneOptions<UserKYC> = {
			where: { id: kycId },
		};
		const kyc = await this.repo.findOne(options);
		if (isValidKyc && !kyc) {
			throw new NotFoundException("4010");
		}
		return kyc;
	}
	// update
	async updateById(kycId: number, attrs: Partial<UserKYC> = {}): Promise<UserKYC> {
		const kyc = await this.findById(kycId, true);
		const { userKyc, mobileKyc, emailKyc, producerKyc } = attrs;
		// update
		Object.assign(kyc, { userKyc, mobileKyc, emailKyc, producerKyc });
		return await this.repo.save(kyc);
	}
	// remove
	async removeById(kycId: number): Promise<UserKYC> {
		const kyc = await this.findById(kycId, true);
		return await this.repo.remove(kyc);
	}
}
