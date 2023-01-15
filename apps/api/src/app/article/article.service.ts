import { Injectable } from '@nestjs/common'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { Observable, from } from 'rxjs'
import { ArticleEntity } from './article.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ArticleResponse } from './types/article-response.interface'
import slugify from 'slugify'
@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
	) {}

	public create(user: UserEntity, createArticleDto: CreateArticleDto): Observable<ArticleEntity> {
		const article = new ArticleEntity()
		Object.assign(article, createArticleDto)
		article.slug = this.getSlug(createArticleDto.title)

		if (!article.tagList) {
			article.tagList = []
		}
		article.author = user

		return from(this.articleRepository.save(article))
	}

	public buildArticleResponse(article: ArticleEntity): ArticleResponse {
		return { article }
	}

	private getSlug(title: string): string {
		return (
			slugify(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString()
		)
	}
}
