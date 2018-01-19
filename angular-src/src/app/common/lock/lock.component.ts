import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss']
})
export class LockComponent implements OnInit {

  data = localStorage.getItem("facility");
  facility = this.data.replace(/['"]+/g, '');
  pin = '';

  constructor() { }


  ngOnInit() {
  }

  add(number) {
    this.pin = this.pin + number;
  }

  clear() {
    this.pin = '';
  }
}

// TODO: What happens when a user logs in then changes the URL manually?
//    On AUTHENTICATE: Reissue JWT once a user or admin logs in with ACTIVE USER
//    Each component needs a check to the JWT to read the ACTIVE USER
//    If there is no ACTIVE USER then force the lock screen open
//    On LOCK: Reissue JWT with a null ACTIVE USER
