import { ProfileType } from './profile.type'

export interface ProfileResponse {
	profile: Pick<ProfileType, 'username' | 'bio' | 'image' | 'following'>
}
