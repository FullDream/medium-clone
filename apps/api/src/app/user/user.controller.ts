import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common'
import { Request } from 'express'
import { Observable, mergeMap, of } from 'rxjs'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { UserResponse } from './types/user-response.interface'
import { LoginUserDto } from './dto/login-user.dto'
import { ExpressRequest } from '../../types/express-request.interface'

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@UsePipes(new ValidationPipe())
	public create(@Body('user') createUserDto: CreateUserDto): Observable<UserResponse> {
		return this.userService
			.create(createUserDto)
			.pipe(mergeMap(user => this.userService.buildUserResponse(user)))
	}

	@Post('users/login')
	@UsePipes(new ValidationPipe())
	public login(@Body('user') loginUserDto: LoginUserDto): Observable<UserResponse> {
		return this.userService
			.login(loginUserDto)
			.pipe(mergeMap(user => this.userService.buildUserResponse(user)))
	}

	@Get('user')
	public currentUser(@Req() request: ExpressRequest): Observable<UserResponse> {
		return this.userService.buildUserResponse(request.user)
	}
}
