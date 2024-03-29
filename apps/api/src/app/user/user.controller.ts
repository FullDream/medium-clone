import { Body, Controller, Get, Post, Put, UseGuards, UsePipes } from '@nestjs/common'
import { Observable, mergeMap } from 'rxjs'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { LoginUserDto } from './dto/login-user.dto'
import { User } from './decorators/user.decorator'
import { UserEntity } from './user.entity'
import { AuthGuard } from './guards/auth.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { BackendValidationPipe } from '../common/pipes/backend-validation.pipe'
import { CurrentUserResponse } from '@medium-clone/api-interfaces'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@UsePipes(new BackendValidationPipe())
	public create(@Body('user') createUserDto: CreateUserDto): Observable<CurrentUserResponse> {
		return this.userService
			.create(createUserDto)
			.pipe(mergeMap(user => this.userService.buildUserResponse(user)))
	}

	@Post('users/login')
	@UsePipes(new BackendValidationPipe())
	public login(@Body('user') loginUserDto: LoginUserDto): Observable<CurrentUserResponse> {
		return this.userService
			.login(loginUserDto)
			.pipe(mergeMap(user => this.userService.buildUserResponse(user)))
	}

	@Get('user')
	@UseGuards(AuthGuard)
	public currentUser(@User() user: UserEntity): Observable<CurrentUserResponse> {
		return this.userService.buildUserResponse(user)
	}

	@Put('user')
	@UseGuards(AuthGuard)
	public update(
		@User('id') userId: number,
		@Body('user') updateUserDto: UpdateUserDto,
	): Observable<CurrentUserResponse> {
		return this.userService
			.update(userId, updateUserDto)
			.pipe(mergeMap(user => this.userService.buildUserResponse(user)))
	}
}
