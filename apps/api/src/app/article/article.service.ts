import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { Observable, from, mergeMap } from 'rxjs'
import { ArticleEntity } from './article.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { ArticleResponse } from './types/article-response.interface'
import slugify from 'slugify'
import { UpdateArticleDto } from './dto/update-article.dto'
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

	public findBySlug(slug: string): Observable<ArticleEntity> {
		return from(this.articleRepository.findOne({ where: { slug } }))
	}

	public update(
		slug: string,
		userId: number,
		updateArticleDto: UpdateArticleDto,
	): Observable<ArticleEntity> {
		return this.findBySlug(slug).pipe(
			mergeMap(article => {
				if (!article) {
					throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
				}

				if (article.author.id !== userId) {
					throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
				}

				const newArticle = { ...article, ...updateArticleDto }

				if (updateArticleDto.title && updateArticleDto.title !== article.title) {
					newArticle.slug = this.getSlug(updateArticleDto.title)
				}

				return from(this.articleRepository.save(newArticle))
			}),
		)
	}

	public delete(slug: string, userId: number): Observable<DeleteResult> {
		return this.findBySlug(slug).pipe(
			mergeMap(article => {
				if (!article) {
					throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND)
				}

				if (article.author.id !== userId) {
					throw new HttpException('You are not author', HttpStatus.FORBIDDEN)
				}

				return from(this.articleRepository.delete({ slug }))
			}),
		)
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
