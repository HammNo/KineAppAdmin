import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginService } from 'src/app/core/services/login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastTemplatesService } from 'src/app/core/services/toast-templates.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  host: {'class': 'content-page flex-row flex-jCenter'}
})
export class LoginPage implements OnInit, OnDestroy {

  fg!: FormGroup;
  isLogged : boolean = false;
  destroyed$: Subject<boolean> = new Subject();

  constructor(
    private _loginSvc : LoginService,
    private _fb: FormBuilder,
    private _toastTemplatesSvc : ToastTemplatesService,
    private _router : NavController
  ) { }

  ngOnInit() {
    this._loginSvc.token$
                      .pipe(takeUntil(this.destroyed$))
                      .subscribe(data => {
                        this.isLogged = true;
                      });
    this.fg = this._fb.group({
                        username: [null, [Validators.required]],
                        password: [null, [Validators.required]]
                      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }

  submit(){
    if(this.fg.invalid)
      return;
    this._loginSvc.login(this.fg.value).subscribe({
      next : async (data) =>{
        this._toastTemplatesSvc.authSuccess();
        this._router.navigateRoot(['home']);
      },
      error : async (err) => {
        this._toastTemplatesSvc.authFail();
      }
    });
    // this._loginSvc.loginMock(); //!for developement without API purpose
    // this._toastTemplatesSvc.authSuccess(); //!for developement without API purpose
    // this._router.navigateRoot(['home']); //!for developement without API purpose
  }

}
