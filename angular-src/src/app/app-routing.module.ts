import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

// Components Import
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {RegisterComponent} from './components/register/register.component';
import {PasswordResetComponent} from './components/password-reset/password-reset.component';
import {PasswordResetRequestComponent} from './components/password-reset-request/password-reset-request.component';

// Guards
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes =  [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'password_reset', component: PasswordResetComponent },
  { path: 'password_reset_request', component: PasswordResetRequestComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
