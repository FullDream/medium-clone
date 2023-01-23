import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { RegisterComponent } from './components/register'

const routes: Routes = [
	{
		path: 'register',
		component: RegisterComponent,
	},
]

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes)],
	declarations: [RegisterComponent],
	providers: [],
	exports: [RegisterComponent],
})
export class AuthModule {}
