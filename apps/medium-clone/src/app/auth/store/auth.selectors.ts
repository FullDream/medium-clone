import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthStateInterface } from '../types'
import { authReducerKey } from './auth.reducer'

export const authFeatureSelector = createFeatureSelector<AuthStateInterface>(authReducerKey)

export const isSubmittingSelector = createSelector(
	authFeatureSelector,
	authState => authState.isSubmitting,
)

export const validationErrorSelector = createSelector(
	authFeatureSelector,
	authState => authState.validationError,
)

export const isLoggedInSelector = createSelector(
	authFeatureSelector,
	authState => authState.isLoggedIn,
)

export const isAnonymousSelector = createSelector(
	authFeatureSelector,
	authState => authState.isLoggedIn === false,
)

export const currentUserSelector = createSelector(
	authFeatureSelector,
	authState => authState.currentUser,
)
