import { Controller, Get, Param } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileResponse } from './types/profile-response.interface'

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':username')
	public async findProfile(@Param('username') username: string): Promise<ProfileResponse> {
		const profile = await this.profileService.find(username)
		return this.profileService.buildProfileResponse(profile)
	}
}
