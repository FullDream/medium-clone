import { createAction, props } from '@ngrx/store'
import { ActionsTypes } from '../actions.types'
import { CurrentUserInterface } from '@medium-clone/api-interfaces'

export const getCurrentUserAction = createAction(ActionsTypes.GET_CURRENT_USER)

export const getCurrentUserSuccessAction = createAction(
	ActionsTypes.GET_CURRENT_USER,
	props<{ currentUser: CurrentUserInterface }>(),
)

export const getCurrentUserFailureAction = createAction(ActionsTypes.GET_CURRENT_USER_FAILURE)
