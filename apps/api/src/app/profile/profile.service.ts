import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../user/user.entity'
import { ProfileResponse } from './types/profile-response.interface'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) {}

	public async find(username: string): Promise<UserEntity> {
		return this.userRepository.findOne({ where: { username } })
	}

	public buildProfileResponse({ username, bio, image }: UserEntity): ProfileResponse {
		return {
			profile: { username, bio, image, favorited: false },
		}
	}
}
