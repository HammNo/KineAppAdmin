import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdminModel } from '../models/admin.model';
import { LoginRequestModel, LoginResponseModel } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  token$: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);
  profile$: BehaviorSubject<AdminModel|null> = new BehaviorSubject<AdminModel|null>(null);

  constructor(
    private _http: HttpClient
  ) {
    let data = localStorage.getItem('user');
    if(data){
      let obj = JSON.parse(data);
      this.token$.next(obj.token);
      this.profile$.next(obj.profile);
    }
  }

  login(loginInfos: LoginRequestModel): Observable<LoginResponseModel> {
    return this._http.post<LoginResponseModel>(environment.base_url + '/Auth/administrate', loginInfos)
      .pipe(
        tap(response => {
          this.token$.next(response.token);
          this.profile$.next(response.profile);
          let string = JSON.stringify(response);
          localStorage.setItem('user', string);
        }),
        catchError(err =>{
          throw err.error;
        })
      );
  }

  logout(){
    this.token$.next(null);
    this.profile$.next(null);
    localStorage.removeItem('user');
  }
}
