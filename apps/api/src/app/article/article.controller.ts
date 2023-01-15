import { Controller, Post, UseGuards, Body } from '@nestjs/common'
import { Observable, map } from 'rxjs'
import { ArticleService } from './article.service'
import { AuthGuard } from '../user/guards/auth.guard'
import { User } from '../user/decorators/user.decorator'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { ArticleResponse } from './types/article-response.interface'

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	@UseGuards(AuthGuard)
	public create(
		@User() user: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto,
	): Observable<ArticleResponse> {
		return this.articleService
			.create(user, createArticleDto)
			.pipe(map(data => this.articleService.buildArticleResponse(data)))
	}
}
