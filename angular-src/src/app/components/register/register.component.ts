import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {User} from '../../interfaces/user.interface';
import {matchOtherValidator} from '../../validators/match-other-validator';
import {passwordValidator} from '../../validators/password-validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  user: User;
  registerForm: FormGroup;
  serviceResponse: any;


  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.user = {
      name: '',
      facility: '',
      email: '',
      password: '',
      confirmPassword: '',
      adminPin: null,
    };


    // at least one lowercase and one uppercase alphabetical character
    // OR
    // at least one lowercase and one numeric character
    // OR
    // at least one uppercase and one numeric character.

    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    this.registerForm = new FormGroup({
      'name': new FormControl(this.user.name, [Validators.required]),
      'facility': new FormControl(this.user.facility, [Validators.required]),
      'email': new FormControl(this.user.email, [
        Validators.required,
        Validators.pattern(emailRegex)
      ]),
      'password': new FormControl(this.user.password, [
        Validators.required,
        passwordValidator({
          minLength: 8,
          maxLength: 32,
          requireLetters: true,
          requireLowerCaseLetters: true,
          requireUpperCaseLetters: true,
          requireNumbers: true,
          requireSpecialCharacters: true
        })
      ]),
      'confirmPassword': new FormControl(this.user.confirmPassword, [
        Validators.required,
        matchOtherValidator('password'),
      ]),
      'adminPin': new FormControl(this.user.adminPin, [
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]{6}$'),
        Validators.required,
      ])
    });
  }

  get name() {
    return this.registerForm.get('name');
  }

  get facility() {
    return this.registerForm.get('facility');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get adminPin() {
    return this.registerForm.get('adminPin');
  }

  // TODO: make form update model before sending

  save() {
    if (this.registerForm.status === 'VALID') {
      this.authService.registerUser(this.user).subscribe(data => {
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
          console.log(err);
        }
      );
    }
  }
}
