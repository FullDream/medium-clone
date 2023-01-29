import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'

import { registerAction } from '../../store/actions/register.actions'
import { isSubmittingSelector, ValidationErrorSelector } from '../../store/auth.selectors'
import { BackendErrorsInterface } from '../../../common/types/backend-errors.interface'

@Component({ selector: 'mc-register', templateUrl: './register.component.html' })
export class RegisterComponent implements OnInit {
	public form!: FormGroup
	public isSubmitting$!: Observable<boolean>
	public backendErrors$!: Observable<BackendErrorsInterface | null>

	constructor(private readonly fb: FormBuilder, private readonly store: Store) {}

	ngOnInit(): void {
		this.initializeForm()
		this.initializeValues()
	}

	private initializeForm(): void {
		this.form = this.fb.group({
			username: ['', Validators.required],
			email: '',
			password: '',
		})
	}

	private initializeValues(): void {
		this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector))
		this.backendErrors$ = this.store.pipe(select(ValidationErrorSelector))
	}

	public onSubmit(): void {
		this.store.dispatch(registerAction({ request: { user: this.form.value } }))
	}
}
