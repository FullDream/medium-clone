import {
	CanActivate,
	ExecutionContext,
	HttpException,
	HttpStatus,
	Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { ExpressRequest } from '../../../types/express-request.interface'

@Injectable()
export class AuthGuard implements CanActivate {
	public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest<ExpressRequest>()

		if (request.user) {
			return true
		}

		throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
	}
}
