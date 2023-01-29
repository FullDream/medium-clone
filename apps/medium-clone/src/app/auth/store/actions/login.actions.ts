import { createAction, props } from '@ngrx/store'

import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { ActionsTypes } from '../actions.types'
import { BackendErrorsInterface } from '../../../common/types'
import { LoginRequestInterface } from '../../types'

export const loginAction = createAction(
	ActionsTypes.LOGIN,
	props<{ request: LoginRequestInterface }>(),
)

export const loginSuccessAction = createAction(
	ActionsTypes.LOGIN_SUCCESS,
	props<{ currentUser: CurrentUserInterface }>(),
)

export const loginFailureAction = createAction(
	ActionsTypes.LOGIN_FAILURE,
	props<{ errors: BackendErrorsInterface }>(),
)
