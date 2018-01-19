import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LockComponent} from '../../common/lock/lock.component';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(public lock: MatDialog,
              private authService: AuthService) { }

  ngOnInit() {
  }

  onClick() {
    this.lock.open(LockComponent, {
      width: '350px',
      disableClose: true,
    });
  }

  onClickTwo() {
    const decoded = this.authService.decodeToken();
    console.log(decoded.superuser, decoded.email);
    };
}
