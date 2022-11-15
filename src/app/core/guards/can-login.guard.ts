import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { Observable } from "rxjs";
import { LoginService } from "../services/login.service";
import { ToastTemplatesService } from "../services/toast-templates.service";

@Injectable({
  providedIn: 'root'
})
export class CanLoginGuard implements CanActivate{
  constructor(
     private _loginSvc: LoginService,
     private _toastTemplatesSvc : ToastTemplatesService,
     private _router : Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      const isConnected = this._loginSvc.token$.value != null;
      if(isConnected){
        this._toastTemplatesSvc.alreadyConnected();
        this._router.navigate(['home']);
      }
      return !isConnected;
  }
}
