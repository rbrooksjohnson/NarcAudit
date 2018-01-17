import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tokenNotExpired} from 'angular2-jwt';
import {ServerConfig} from '../common/server/server.config';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient,
              public servers: ServerConfig) {
  }

  registerUser(user) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      'http://'+this.servers.backEnd+'/users/register',
      user,
      {headers: headers});
  };

  loginUser(user) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      'http://'+this.servers.backEnd+'/users/authenticate',
      user,
      {headers: headers});
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

  resetPassword(body) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      'http://'+this.servers.backEnd+'/users/password_reset',
      body,
      {headers: headers});
  };

  resetPasswordRequest(email) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const query = '?email='+email;
    return this.http.get(
      'http://'+this.servers.backEnd+'/users/password_reset'+query,
      {headers: headers});
  };
}
