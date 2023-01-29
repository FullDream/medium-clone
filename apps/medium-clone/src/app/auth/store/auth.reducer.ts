import { createReducer, on } from '@ngrx/store'
import { AuthStateInterface } from '../types'
import {
	loginAction,
	loginFailureAction,
	loginSuccessAction,
	registerAction,
	registerFailureAction,
	registerSuccessAction,
	getCurrentUserAction,
	getCurrentUserSuccessAction,
	getCurrentUserFailureAction,
} from './actions'

const initialState: AuthStateInterface = {
	isSubmitting: false,
	isLoading: false,
	currentUser: null,
	isLoggedIn: null,
	validationError: null,
}

export const authReducerKey = 'auth'

export const authReducer = createReducer(
	initialState,
	on(
		registerAction,
		(state): AuthStateInterface => ({
			...state,
			isSubmitting: true,
			validationError: null,
		}),
	),
	on(
		registerSuccessAction,
		(state, { currentUser }): AuthStateInterface => ({
			...state,
			isSubmitting: false,
			isLoggedIn: true,
			validationError: null,
			currentUser,
		}),
	),
	on(
		registerFailureAction,
		(state, action): AuthStateInterface => ({
			...state,
			isSubmitting: false,
			isLoggedIn: false,
			currentUser: null,
			validationError: action.errors,
		}),
	),
	on(
		loginAction,
		(state): AuthStateInterface => ({
			...state,
			isSubmitting: true,
			validationError: null,
		}),
	),
	on(
		loginSuccessAction,
		(state, action): AuthStateInterface => ({
			...state,
			isSubmitting: false,
			isLoggedIn: true,
			validationError: null,
			currentUser: action.currentUser,
		}),
	),
	on(
		loginFailureAction,
		(state, action): AuthStateInterface => ({
			...state,
			isSubmitting: false,
			isLoggedIn: false,
			currentUser: null,
			validationError: action.errors,
		}),
	),
	on(
		getCurrentUserAction,
		(state): AuthStateInterface => ({
			...state,
			isLoading: true,
		}),
	),
	on(
		getCurrentUserSuccessAction,
		(state, { currentUser }): AuthStateInterface => ({
			...state,
			isLoading: false,
			isLoggedIn: true,
			currentUser,
		}),
	),
	on(
		getCurrentUserFailureAction,
		(state): AuthStateInterface => ({
			...state,
			isLoading: false,
			isLoggedIn: false,
			currentUser: null,
		}),
	),
)
