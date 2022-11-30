import { Injectable } from '@nestjs/common'
import { Message } from '@medium-clone/api-interfaces'

@Injectable()
export class AppService {
	public getData(): Message {
		return { message: 'Welcome to api!' }
	}
}
