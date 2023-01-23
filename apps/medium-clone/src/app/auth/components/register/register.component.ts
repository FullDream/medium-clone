import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'

import { registerAction } from '../../store/actions/register.action'
import { isSubmittingSelector } from '../../store/auth.selectors'

@Component({ selector: 'mc-register', templateUrl: './register.component.html' })
export class RegisterComponent implements OnInit {
	public form!: FormGroup
	public isSubmitting$!: Observable<boolean>

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
	}

	public onSubmit(): void {
		this.store.dispatch(registerAction(this.form.value))
	}
}
