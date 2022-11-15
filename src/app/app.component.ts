import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginService } from './core/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  isLogged : boolean = false;
  destroyed$: Subject<boolean> = new Subject();

  constructor(
    private _loginSvc : LoginService,
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
  }

  ngOnDestroy(): void {
    this.destroyed$.next(false);
    this.destroyed$.complete();
  }
}
