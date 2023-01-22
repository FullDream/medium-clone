import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { User } from '../user/decorators/user.decorator'
import { AuthGuard } from '../user/guards/auth.guard'
import { ProfileService } from './profile.service'
import { ProfileResponse } from './types/profile-response.interface'

@Controller('profiles')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get(':username')
	public async findProfile(
		@User('id') currentUserId: number,
		@Param('username') username: string,
	): Promise<ProfileResponse> {
		const profile = await this.profileService.find(currentUserId, username)
		return this.profileService.buildProfileResponse(profile)
	}

	@Post(':username/follow')
	@UseGuards(AuthGuard)
	public async followProfile(
		@User('id') currentUserId: number,
		@Param('username') username: string,
	): Promise<ProfileResponse> {
		const profile = await this.profileService.followProfile(currentUserId, username)
		return this.profileService.buildProfileResponse(profile)
	}

	@Delete(':username/follow')
	@UseGuards(AuthGuard)
	public async unfollowProfile(
		@User('id') currentUserId: number,
		@Param('username') username: string,
	): Promise<ProfileResponse> {
		const profile = await this.profileService.unfollowProfile(currentUserId, username)
		return this.profileService.buildProfileResponse(profile)
	}
}
