import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Observable, of, from, forkJoin, mergeMap, map } from 'rxjs'
import { Repository } from 'typeorm'
import { sign } from 'jsonwebtoken'

import { CreateUserDto } from './dto/create-user.dto'
import { UserEntity } from './user.entity'
import { JWT_SECRET } from '../../configs/jwt.config'
import { UserResponse } from './types/user-response.interface'
import { LoginUserDto } from './dto/login-user.dto'
import { compare } from 'bcrypt'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) {}
	public create(createUserDto: CreateUserDto): Observable<UserEntity> {
		const newUser = new UserEntity()
		Object.assign(newUser, createUserDto)
		const userByEmail = from(this.userRepository.findOne({ where: { email: createUserDto.email } }))
		const userByUsername = from(
			this.userRepository.findOne({ where: { username: createUserDto.username } }),
		)

		return forkJoin([userByEmail, userByUsername]).pipe(
			mergeMap(([email, username]) => {
				if (email || username) {
					throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
				}
				return from(this.userRepository.save(newUser))
			}),
		)
	}

	public login(loginUserDto: LoginUserDto): Observable<UserEntity> {
		const userByEmail = from(
			this.userRepository
				.createQueryBuilder()
				.select('*')
				.where('email = :email', { email: loginUserDto.email })
				.getRawOne(),
		)

		return userByEmail.pipe(
			mergeMap(user => {
				if (!user) {
					throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
				}
				return from(compare(loginUserDto.password, user.password)).pipe(
					map(isPasswordCompare => {
						if (!isPasswordCompare) {
							throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
						}
						delete user.password
						return user
					}),
				)
			}),
		)
	}

	public findById(id: number): Observable<UserEntity> {
		return from(this.userRepository.findOne({ where: { id } }))
	}

	private generateJwt({ id, email, username }: UserEntity): string {
		return sign({ id, email, username }, JWT_SECRET)
	}

	public buildUserResponse(user: UserEntity): Observable<UserResponse> {
		return of({
			user: {
				...user,
				token: this.generateJwt(user),
			},
		})
	}
}
