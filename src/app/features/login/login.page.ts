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
    private _loginService : LoginService,
    private _fb: FormBuilder,
    private _toastTemplatesService : ToastTemplatesService,
    private _router : NavController
  ) { }

  ngOnInit() {
    this._loginService.token$
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
    // if(this.fg.invalid)
    //   return;
    // this._loginService.login(this.fg.value).subscribe({
    //   next : async (data) =>{
    //     this._toastTemplatesService.authSuccess();
    //     this._router.navigateRoot(['home']);
    //   },
    //   error : async (err) => {
    //     this._toastTemplatesService.authFail();
    //   }
    // });
    this._loginService.loginMock(); //!for developement without API purpose
    this._toastTemplatesService.authSuccess(); //!for developement without API purpose
    this._router.navigateRoot(['home']); //!for developement without API purpose
  }

}
