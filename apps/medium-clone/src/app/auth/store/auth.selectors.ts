import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthStateInterface } from '../types'
import { authReducerKey } from './auth.reducer'

export const authFeatureSelector = createFeatureSelector<AuthStateInterface>(authReducerKey)

export const isSubmittingSelector = createSelector(
	authFeatureSelector,
	authState => authState.isSubmitting,
)

export const ValidationErrorSelector = createSelector(
	authFeatureSelector,
	authState => authState.validationError,
)
