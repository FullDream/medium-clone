import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { UserEntity } from '../user/user.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { Observable, from, mergeMap, forkJoin, map, of, lastValueFrom } from 'rxjs'
import { ArticleEntity } from './article.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository } from 'typeorm'
import { ArticleResponse } from './types/article-response.interface'
import slugify from 'slugify'
import { UpdateArticleDto } from './dto/update-article.dto'
import { ArticlesQuery } from './types/articles-query.interface'
import { ArticlesResponse } from './types/articles-response.interface'
@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) {}

	public async findAll(
		userId: number,
		{ limit, offset, author, tag, favorited }: ArticlesQuery,
	): Promise<ArticlesResponse> {
		const queryBuilder = this.articleRepository
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author')

		queryBuilder.orderBy('articles.createdAt', 'DESC')

		const articlesCount = await queryBuilder.getCount()

		if (favorited) {
			const author = await this.userRepository.findOne({
				where: { username: favorited },
				relations: ['favorites'],
			})

			const ids = author.favorites.map(item => item.id)

			queryBuilder.andWhere('articles.authorId IN (:...ids)', { ids })
		}

		if (tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${tag}%`,
			})
		}

		if (author) {
			const authorRep = await this.userRepository.findOne({ where: { username: author } })
			queryBuilder.andWhere('articles.authorId = :id', { id: authorRep.id })
		}

		if (limit) queryBuilder.limit(limit)
		if (offset) queryBuilder.offset(offset)

		let favoriteIds: number[] = []
		if (userId) {
			const currentUser = await this.userRepository.findOne({
				where: { id: userId },
				relations: ['favorites'],
			})

			favoriteIds = currentUser.favorites.map(favorite => favorite.id)
		}

		const articles = await queryBuilder.getMany()
		const articlesWithFavorites = articles.map(article => {
			const favorited = favoriteIds.includes(article.id)
			return { ...article, favorited }
		})

		return { articles: articlesWithFavorites, articlesCount }
	}

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

	public async addArticleToFavorites(slug: string, userId: number): Promise<ArticleEntity> {
		const article = await lastValueFrom(this.findBySlug(slug))
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['favorites'],
		})

		const isNotFavorited =
			user.favorites.findIndex(articleInFavorites => articleInFavorites.id === article.id) === -1

		if (isNotFavorited) {
			user.favorites.push(article)
			article.favoritesCount++
			await this.userRepository.save(user)
			await this.articleRepository.save(article)
		}

		return article
	}

	public async deleteArticleFromFavorites(slug: string, userId: number): Promise<ArticleEntity> {
		const article = await lastValueFrom(this.findBySlug(slug))
		const user = await this.userRepository.findOne({
			where: { id: userId },
			relations: ['favorites'],
		})

		const articleIndex = user.favorites.findIndex(
			articleInFavorites => articleInFavorites.id === article.id,
		)

		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1)
			article.favoritesCount--
			await this.userRepository.save(user)
			await this.articleRepository.save(article)
		}

		return article
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
