import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-password-reset-request',
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss']
})
export class PasswordResetRequestComponent implements OnInit {

  email: String;
  serviceResponse: any;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i),
  ]);

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar,) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.emailFormControl.status === 'VALID') {
      this.authService.resetPasswordRequest(this.email).subscribe(response => {
        this.serviceResponse = response;
        this.snackBar.open(this.serviceResponse.msg, 'OK', {duration: 3000});
        if (this.serviceResponse.success) {
          this.router.navigate(['./']);
        }
      })
    } else {
      this.snackBar.open('Error: Forms are not valid, try again', 'OK', {duration: 3000});
    }
  }
}
