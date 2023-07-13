import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { User } from "../users/user.entity";

import { Beats } from "./beats.entity";
import { CreateBeatDto } from "./beats.dto";

@Injectable()
export class BeatsService {
	constructor(@InjectRepository(Beats) private repo: Repository<Beats>) {}
	// create
	create(BeatDto: CreateBeatDto, user: User) {
		const beat = this.repo.create(BeatDto);
		beat.user = user;
		return this.repo.save(beat);
	}
	// changeApproval
	async changeApproval(id: string, approved: boolean) {
		const beat = await this.repo.findOne(id);
		if (!beat) {
			throw new NotFoundException("Beat not found");
		}
		beat.approved = approved;
		return this.repo.save(beat);
	}
}
