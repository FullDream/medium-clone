import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable } from 'rxjs'
import { PersistanceService } from './persistance.service'
import { StorageKeys } from '../constants/storage-keys.enum'

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private readonly persistanceService: PersistanceService) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		const token = this.persistanceService.get<string>(StorageKeys.ACCESS_TOKEN)

		request = request.clone({
			setHeaders: {
				Authorization: token ? `Token ${token}` : '',
			},
		})

		return next.handle(request)
	}
}
