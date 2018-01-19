import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {MatDialog} from '@angular/material';
import {LockComponent} from '../../common/lock/lock.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {

  email: String;
  password: String;
  serviceResponse: any;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.minLength(6),
    Validators.required,
  ]);

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar,
              public lock: MatDialog) {
  }

  ngOnInit() {

  }

  onLoginSubmit() {
    const user = {
      email: this.email,
      password: this.password
    };
    if (this.emailFormControl.status === 'VALID' && this.passwordFormControl.status === 'VALID') {
      this.authService.loginUser(user).subscribe(data => {
          this.serviceResponse = data;
          this.snackBar.open(this.serviceResponse.msg, 'OK', { duration: 3000 });
          if (this.serviceResponse.success) {
            this.authService.storeUserData(this.serviceResponse.token, this.serviceResponse.user);
            this.router.navigate(['./dashboard']);
            this.lock.open(LockComponent, {
              width: '350px',
              disableClose: true,
            });

          } else {
          }
        },
        err => {
          this.snackBar.open('Error: '+err, 'OK', { duration: 3000 });
        }
      );
    }
  }
}
