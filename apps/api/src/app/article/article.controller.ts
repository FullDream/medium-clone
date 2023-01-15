import {
	Controller,
	Post,
	UseGuards,
	Body,
	Get,
	Param,
	Delete,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { ArticleService } from './article.service'
import { AuthGuard } from '../user/guards/auth.guard'
import { User } from '../user/decorators/user.decorator'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { ArticleResponse } from './types/article-response.interface'
import { DeleteResult } from 'typeorm'
import { UpdateArticleDto } from './dto/update-article.dto'

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	public create(
		@User() user: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto,
	): Observable<ArticleResponse> {
		return this.articleService
			.create(user, createArticleDto)
			.pipe(map(data => this.articleService.buildArticleResponse(data)))
	}

	@Get(':slug')
	public findBySlug(@Param('slug') slug: string): Observable<ArticleResponse> {
		return this.articleService
			.findBySlug(slug)
			.pipe(map(data => this.articleService.buildArticleResponse(data)))
	}

	@Put(':slug')
	@UseGuards(AuthGuard)
	@UsePipes(new ValidationPipe())
	public update(
		@User('id') userId: number,
		@Param('slug') slug: string,
		@Body('article') updateArticleDto: UpdateArticleDto,
	): Observable<ArticleResponse> {
		return this.articleService
			.update(slug, userId, updateArticleDto)
			.pipe(map(data => this.articleService.buildArticleResponse(data)))
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	public delete(@User('id') userId: number, @Param('slug') slug: string): Observable<DeleteResult> {
		return this.articleService.delete(slug, userId)
	}
}
