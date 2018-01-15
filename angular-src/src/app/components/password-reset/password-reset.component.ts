import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  new_password: String;
  verify_password: String;
  token: String;
  serviceResponse: any;

  passwordNewFormControl = new FormControl('', [
    Validators.minLength(8),
    Validators.required,
  ]);

  passwordVerifyFormControl = new FormControl('', [
    Validators.minLength(8),
    Validators.required,
  ]);

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.token = params['token'];
      console.log(this.token);
    });
  }

  onSubmit() {

    if (this.passwordNewFormControl.status === 'VALID' && this.passwordVerifyFormControl.status === 'VALID') {
      if (this.new_password === this.verify_password) {
        const body = {
          token: this.token,
          password: this.new_password
        };
        this.authService.resetPassword(body).subscribe(response => {
          this.serviceResponse = response;
          if (this.serviceResponse.success) {
            this.snackBar.open(this.serviceResponse.msg, 'OK', { duration: 3000 });
            this.router.navigate(['./login']);
          } else {
            this.snackBar.open('Error: Please reset your password again', 'OK', {duration: 3000});
          }
        });
      } else {
        this.snackBar.open('Error: Passwords MUST match', 'OK', {duration: 3000});
      }
    } else {
      this.snackBar.open('Error: Forms are not valid, try again', 'OK', {duration: 3000});
    }
  }
}

