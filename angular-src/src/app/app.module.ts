import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Components Import for Declaration
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordResetRequestComponent } from './components/password-reset-request/password-reset-request.component';

// Common Components
import { LockComponent } from './common/lock/lock.component';
import { MaterialModule } from './common/material/material.module';

// Common Module Imports
import { AppRoutingModule } from './app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ServerConfig } from './common/server/server.config';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    PasswordResetComponent,
    PasswordResetRequestComponent,
    LockComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [AuthService, AuthGuard, ServerConfig],
  bootstrap: [AppComponent]
})
export class AppModule { }
