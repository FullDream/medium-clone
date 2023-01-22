import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserEntity } from '../user/user.entity'
import { FollowEntity } from './follow.entity'
import { ProfileResponse } from './types/profile-response.interface'
import { ProfileType } from './types/profile.type'

@Injectable()
export class ProfileService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
	) {}

	public async find(currentUserId: number, username: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ where: { username } })

		if (!user) {
			throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
		}

		const follow = await this.followRepository.findOne({
			where: { followerId: currentUserId, followingId: user.id },
		})

		return { ...user, following: !!follow }
	}

	public async followProfile(currentUserId: number, username: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ where: { username } })

		if (!user) {
			throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
		}

		if (currentUserId === user.id) {
			throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST)
		}

		const follow = await this.followRepository.findOne({
			where: { followerId: currentUserId, followingId: user.id },
		})

		if (!follow) {
			const followToCreate = new FollowEntity()
			followToCreate.followerId = currentUserId
			followToCreate.followingId = user.id
			await this.followRepository.save(followToCreate)
		}

		return { ...user, following: true }
	}

	public async unfollowProfile(currentUserId: number, username: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ where: { username } })

		if (!user) {
			throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
		}

		if (currentUserId === user.id) {
			throw new HttpException('Follower and following cant be equal', HttpStatus.BAD_REQUEST)
		}

		await this.followRepository.delete({
			followerId: currentUserId,
			followingId: user.id,
		})
		return { ...user, following: false }
	}

	public buildProfileResponse({ username, bio, image, following }: ProfileType): ProfileResponse {
		return {
			profile: { username, bio, image, following },
		}
	}
}
