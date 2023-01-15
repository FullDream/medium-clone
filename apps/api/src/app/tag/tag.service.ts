import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { from, Observable } from 'rxjs'

import { TagEntity } from './tag.entity'

@Injectable()
export class TagService {
	constructor(@InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>) {}

	public findAll(): Observable<TagEntity[]> {
		return from(this.tagRepository.find())
	}
}
