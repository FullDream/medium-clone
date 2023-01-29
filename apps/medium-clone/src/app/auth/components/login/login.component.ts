import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Observable } from 'rxjs'
import { BackendErrorsInterface } from '../../../common/types/backend-errors.interface'
import { Store, select } from '@ngrx/store'
import { isSubmittingSelector, validationErrorSelector } from '../../store/auth.selectors'
import { loginAction } from '../../store/actions/login.actions'

@Component({
	selector: 'mc-login',
	templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
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
			email: ['', Validators.required],
			password: ['', Validators.required],
		})
	}

	private initializeValues(): void {
		this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector))
		this.backendErrors$ = this.store.pipe(select(validationErrorSelector))
	}

	public onSubmit(): void {
		this.store.dispatch(loginAction({ request: { user: this.form.value } }))
	}
}
