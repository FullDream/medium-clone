import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { switchMap, map, catchError, of, tap } from 'rxjs'

import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { AuthSevice } from '../../services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { PersistanceService } from '../../../common/services/persistance.service'
import { Router } from '@angular/router'
import { loginAction, loginFailureAction, loginSuccessAction } from '../actions'
import { StorageKeys } from '../../../common/constants/storage-keys.enum'

@Injectable()
export class LoginEffect {
	public login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(loginAction),
			switchMap(({ request }) =>
				this.authSevice.login(request).pipe(
					map((currentUser: CurrentUserInterface) => {
						console.log(currentUser.token)

						this.persistanceService.set(StorageKeys.ACCESS_TOKEN, currentUser.token)
						return loginSuccessAction({ currentUser })
					}),
					catchError((errorResponse: HttpErrorResponse) =>
						of(loginFailureAction({ errors: errorResponse.error.errors })),
					),
				),
			),
		),
	)

	public redirectAfterSubmit$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(loginSuccessAction),
				tap(() => this.router.navigate(['/'])),
			),
		{ dispatch: false },
	)

	constructor(
		private readonly actions$: Actions,
		private readonly authSevice: AuthSevice,
		private readonly persistanceService: PersistanceService,
		private readonly router: Router,
	) {}
}
