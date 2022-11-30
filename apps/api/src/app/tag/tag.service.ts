import { Injectable } from '@nestjs/common'

@Injectable()
export class TagService {
	public findAll(): string[] {
		return ['draggons', 'ring']
	}
}
