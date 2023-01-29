import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { switchMap, map, catchError, of } from 'rxjs'

import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { AuthSevice } from '../../services/auth.service'
import { PersistanceService } from '../../../common/services/persistance.service'
import {
	getCurrentUserAction,
	getCurrentUserSuccessAction,
	getCurrentUserFailureAction,
} from '../actions'
import { StorageKeys } from '@medium-clone/frontend/app/common/constants/storage-keys.enum'

@Injectable()
export class GetCurrentUserEffect {
	public getCurrentUser$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getCurrentUserAction),
			switchMap(() => {
				if (!this.persistanceService.get<string>(StorageKeys.ACCESS_TOKEN)) {
					return of(getCurrentUserFailureAction())
				}

				return this.authSevice.getCurrentUser().pipe(
					map((currentUser: CurrentUserInterface) => {
						return getCurrentUserSuccessAction({ currentUser })
					}),
					catchError(() => of(getCurrentUserFailureAction())),
				)
			}),
		),
	)

	constructor(
		private readonly actions$: Actions,
		private readonly authSevice: AuthSevice,
		private readonly persistanceService: PersistanceService,
	) {}
}
