import { Injectable, NestMiddleware } from '@nestjs/common'
import { Response, NextFunction } from 'express'
import { ExpressRequest } from '../../../types/express-request.interface'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../../../configs/jwt.config'
import { UserService } from '../user.service'
import { lastValueFrom } from 'rxjs'
@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private readonly userService: UserService) {}

	public async use(req: ExpressRequest, res: Response, next: NextFunction): Promise<void> {
		if (!req.headers.authorization) {
			req.user = null
			next()
			return
		}

		const token = req.headers.authorization.split(' ')[1]
		try {
			const decode = verify(token, JWT_SECRET)
			req.user = await lastValueFrom(this.userService.findById(decode['id']))
			next()
		} catch (error) {
			req.user = null
			next()
		}
	}
}
