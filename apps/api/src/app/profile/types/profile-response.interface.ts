import { UserType } from '../../user/types/user.type'

export interface ProfileResponse {
	profile: Pick<UserType, 'username' | 'bio' | 'image'> & { favorited: boolean }
}
