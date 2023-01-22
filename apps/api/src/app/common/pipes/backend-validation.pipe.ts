import { ArgumentMetadata, PipeTransform, HttpException, HttpStatus } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'

export class BackendValidationPipe implements PipeTransform {
	public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
		const object = plainToInstance(metadata.metatype, value)

		if (typeof object !== 'object') {
			return value
		}
		const errors = await validate(object)

		if (errors.length === 0) {
			return value
		}

		throw new HttpException({ errors: this.formatError(errors) }, HttpStatus.UNPROCESSABLE_ENTITY)
	}

	private formatError(errors: ValidationError[]): Record<string, string[]> {
		return errors.reduce((acc, err) => {
			acc[err.property] = Object.values(err.constraints)
			return acc
		}, {})
	}
}
