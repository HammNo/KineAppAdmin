import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor{

  constructor(
    private _loginSvc: LoginService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("testtest");
    if(this._loginSvc.token$.value) {
      const clone = request.clone({
        setHeaders : { Authorization: 'Bearer ' + this._loginSvc.token$.value}
      });
      return next.handle(clone);
    }
    return next.handle(request);
  }

}
