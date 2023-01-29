import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { switchMap, map, catchError, of, tap } from 'rxjs'

import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { registerAction, registerSuccessAction, registerFailureAction } from '../actions'
import { AuthSevice } from '../../services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { PersistanceService } from '../../../common/services/persistance.service'
import { Router } from '@angular/router'
import { StorageKeys } from '@medium-clone/frontend/app/common/constants/storage-keys.enum'

@Injectable()
export class RegisterEffect {
	public register$ = createEffect(() =>
		this.actions$.pipe(
			ofType(registerAction),
			switchMap(({ request }) =>
				this.authSevice.register(request).pipe(
					map((currentUser: CurrentUserInterface) => {
						this.persistanceService.set(StorageKeys.ACCESS_TOKEN, currentUser.token)
						return registerSuccessAction({ currentUser })
					}),
					catchError((errorResponse: HttpErrorResponse) =>
						of(registerFailureAction({ errors: errorResponse.error.errors })),
					),
				),
			),
		),
	)

	public redirectAfterSubmit$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(registerSuccessAction),
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
