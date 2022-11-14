import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginResponseModel } from '../models/login-response.model';
import { LoginRequestModel } from '../models/login-request.model';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token$: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);
  user$: BehaviorSubject<UserModel|null> = new BehaviorSubject<UserModel|null>(null);

  constructor(
    private _http: HttpClient
  ) {
    let data = localStorage.getItem('user');
    if(data){
      let obj = JSON.parse(data);
      this.token$.next(obj.token);
      this.user$.next(obj.user);
    }
  }

  login(loginInfos: LoginRequestModel): Observable<LoginResponseModel> {
    return this._http.post<LoginResponseModel>(environment.base_url + '/Auth/administrate', loginInfos)
      .pipe(
        tap(response => {
          this.token$.next(response.token);
          this.user$.next(response.user);
          let string = JSON.stringify(response);
          localStorage.setItem('user', string);
        }),
        catchError(err =>{
          throw err.error;
        })
    );
  }

  loginMock(){ //Method for developement without API purpose
    this.token$.next("test test test");
    this.user$.next({name : 'Test', email : 'test@mail.com'});
    let string = JSON.stringify({user : this.user$.value, token : this.token$.value});
    localStorage.setItem('user', string);
  }

  logout(){
    this.token$.next(null);
    this.user$.next(null);
    localStorage.removeItem('user');
  }
}
