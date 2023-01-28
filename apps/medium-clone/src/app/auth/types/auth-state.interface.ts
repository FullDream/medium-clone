import { CurrentUserInterface } from '@medium-clone/api-interfaces'
import { BackendErrorsInterface } from '../../common/types/backend-errors.interface'
export interface AuthStateInterface {
	isSubmitting: boolean
	currentUser: CurrentUserInterface | null
	isLoggedIn: boolean | null
	validationError: BackendErrorsInterface | null
}
