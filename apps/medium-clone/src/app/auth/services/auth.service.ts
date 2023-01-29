import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'

import { CurrentUserInterface, CurrentUserResponseInterface } from '@medium-clone/api-interfaces'
import { RegisterRequestInterface, LoginRequestInterface } from '../types'
import { environment } from '../../../environments/environment'

@Injectable()
export class AuthSevice {
	constructor(private readonly http: HttpClient) {}

	public register(data: RegisterRequestInterface): Observable<CurrentUserInterface> {
		const url = environment.apiUrl + 'users'
		return this.http.post<CurrentUserResponseInterface>(url, data).pipe(map(user => user.user))
	}

	public login(data: LoginRequestInterface): Observable<CurrentUserInterface> {
		const url = environment.apiUrl + 'users/login'
		return this.http.post<CurrentUserResponseInterface>(url, data).pipe(map(user => user.user))
	}
}
