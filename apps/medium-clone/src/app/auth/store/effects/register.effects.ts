import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { switchMap, map, catchError, of } from 'rxjs'

import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { registerAction, registerSuccessAction, registerFailureAction } from '../actions'
import { AuthSevice } from '../../services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'

@Injectable()
export class RegisterEffect {
	public register$ = createEffect(() =>
		this.actions$.pipe(
			ofType(registerAction),
			switchMap(({ request }) =>
				this.authSevice.register(request).pipe(
					map((currentUser: CurrentUserInterface) => {
						return registerSuccessAction({ currentUser })
					}),
					catchError((errorResponse: HttpErrorResponse) =>
						of(registerFailureAction({ errors: errorResponse.error })),
					),
				),
			),
		),
	)

	constructor(private readonly actions$: Actions, private readonly authSevice: AuthSevice) {}
}
