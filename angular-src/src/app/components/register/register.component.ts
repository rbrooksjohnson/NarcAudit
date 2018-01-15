import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  name: String;
  facility: String;
  email: String;
  password: String;
  serviceResponse: any;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
  ]);

  passwordFormControl = new FormControl('', [
    Validators.minLength(8),
    Validators.required,
  ]);

  nameFormControl = new FormControl('', [
    Validators.required,
  ]);

  facilityFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar) {

  }

  ngOnInit() {
  }

  onRegisterSubmit() {
    const user = {
      name: this.name,
      facility: this.facility,
      email: this.email,
      password: this.password

    };
    if (this.emailFormControl.status === 'VALID'
      && this.passwordFormControl.status === 'VALID'
      && this.nameFormControl.status === 'VALID' &&
      this.facilityFormControl.status === 'VALID') {
      this.authService.registerUser(user).subscribe(data => {
          this.serviceResponse = data;
          console.log(this.serviceResponse);
          this.snackBar.open(this.serviceResponse.msg, 'OK', {duration: 3000});
          if (this.serviceResponse.success) {
            this.authService.storeUserData(this.serviceResponse.token, this.serviceResponse.user);
            this.router.navigate(['./dashboard']);
          } else {

          }
        },
        err => {
          this.snackBar.open('Error: Server Offline - Try Again Later', 'OK', {duration: 3000});
        }
      );
    }
  }
}
