import { createAction, props } from '@ngrx/store'

import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { ActionsTypes } from '../actions.types'
import { RegisterRequestInterface } from '../../types'
import { BackendErrorsInterface } from '../../../common/types/backend-errors.interface'

export const registerAction = createAction(
	ActionsTypes.REGISTER,
	props<{ request: RegisterRequestInterface }>(),
)

export const registerSuccessAction = createAction(
	ActionsTypes.REGISTER_SUCCESS,
	props<{ currentUser: CurrentUserInterface }>(),
)

export const registerFailureAction = createAction(
	ActionsTypes.REGISTER_FAILURE,
	props<{ errors: BackendErrorsInterface }>(),
)
