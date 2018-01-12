import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) {
  }

  registerUser(user) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      'http://localhost:3000/users/register',
      user,
      { headers: headers });
  };

  loginUser(user) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      'http://localhost:3000/users/authenticate',
      user,
      { headers: headers });
  };

  getProfile() {
    this.loadToken();
    const headers = new HttpHeaders().set('Content-Type', 'application/json').set('jwt', this.authToken);
    return this.http.get(
      'http://localhost:3000/users/profile',
      { headers: headers });
  };

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  };

  loadToken() {
    this.authToken = localStorage.getItem('id_token');
  };

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  };

  loggedIn() {
    return tokenNotExpired('id_token');
  };
}
