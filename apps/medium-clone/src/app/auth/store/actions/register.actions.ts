import { createAction, props } from '@ngrx/store'

import { ActionTypes } from '../action-types'
import { RegisterRequestInterface } from '../../types'
import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { BackendErrorsInterface } from '../../../common/types/backend-errors.interface'

export const registerAction = createAction(
	ActionTypes.REGISTER,
	props<{ request: RegisterRequestInterface }>(),
)

export const registerSuccessAction = createAction(
	ActionTypes.REGISTER_SUCCESS,
	props<{ currentUser: CurrentUserInterface }>(),
)

export const registerFailureAction = createAction(
	ActionTypes.REGISTER_FAILURE,
	props<{ errors: BackendErrorsInterface }>(),
)
