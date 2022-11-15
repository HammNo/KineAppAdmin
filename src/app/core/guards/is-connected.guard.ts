import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { NavController } from "@ionic/angular";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";

@Injectable({
  providedIn: 'root'
})
export class IsConnectedGuard implements CanActivate{
  constructor(
     private _loginSvc: LoginService,
     private _router : NavController
     ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      const isConnected = this._loginSvc.token$.value != null;
      if(!isConnected){
        this._router.navigateRoot(['/login']);
      }
      return isConnected;
  }
}
