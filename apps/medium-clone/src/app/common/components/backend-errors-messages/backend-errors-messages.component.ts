import { Component, Input, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BackendErrorsInterface } from '../../types/backend-errors.interface'

@Component({
	selector: 'mc-backend-errors-messages',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './backend-errors-messages.component.html',
})
export class BackendErrorsMessagesComponent implements OnInit {
	@Input() public backendErrors!: BackendErrorsInterface

	public messages!: string[]

	ngOnInit(): void {
		this.messages = Object.entries(this.backendErrors).map(
			([key, value]) => `${key} ${value.join(', ')}`,
		)
	}
}
