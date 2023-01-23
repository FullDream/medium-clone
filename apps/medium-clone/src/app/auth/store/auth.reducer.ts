import { createReducer, on } from '@ngrx/store'
import { AuthStateInterface } from '../types'
import { registerAction } from './actions'

const initialState: AuthStateInterface = {
	isSubmitting: false,
}

export const authReducerKey = 'auth'

export const authReducer = createReducer(
	initialState,
	on(
		registerAction,
		(state): AuthStateInterface => ({
			...state,
			isSubmitting: true,
		}),
	),
)
