import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginService } from 'src/app/core/services/login.service';
import { NavController } from "@ionic/angular";
import { ToastTemplatesService } from 'src/app/core/services/toast-templates.service';
import { UserModel } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-login-infos',
  templateUrl: './login-infos.component.html',
  styleUrls: ['./login-infos.component.scss'],
})
export class LoginInfosComponent implements OnInit, OnDestroy {

  isLogged : boolean = false;
  destroyed$: Subject<boolean> = new Subject();
  user! : UserModel | null;

  constructor(
    private _loginSvc : LoginService,
    private _router : NavController,
    private _toastTemplatesSvc : ToastTemplatesService,
  ) { }

  ngOnInit() {
    this._loginSvc.token$
                      .pipe(takeUntil(this.destroyed$))
                      .subscribe(data => {
                        if(data != null){
                          this.isLogged = true;
                        }
                        else{
                          this.isLogged = false;
                        }
                      });
    this._loginSvc.user$
                      .pipe(takeUntil(this.destroyed$))
                      .subscribe(data => {
                        if(data != null){
                          this.user = data;
                        }
                      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

  logout(){
    if(this.isLogged){
      this._loginSvc.logout();
      this._router.navigateRoot(['login']);
      this._toastTemplatesSvc.logout();
    }
  }

}
