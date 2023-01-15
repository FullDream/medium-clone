import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { Observable, mergeMap } from 'rxjs'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'
import { UserResponse } from './types/user-response.interface'
import { LoginUserDto } from './dto/login-user.dto'

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
}
