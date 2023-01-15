import { Controller, Get } from '@nestjs/common'
import { map, Observable } from 'rxjs'

import { TagService } from './tag.service'

@Controller('tags')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Get()
	public findAll(): Observable<{ tags: string[] }> {
		return this.tagService.findAll().pipe(map((data) => ({ tags: data.map((item) => item.name) })))
	}
}
