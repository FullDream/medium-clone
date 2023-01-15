import { User } from './user.type'
export interface UserResponse {
	user: User & { token: string }
}
