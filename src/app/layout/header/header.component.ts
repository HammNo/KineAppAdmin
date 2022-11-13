import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LoginService } from 'src/app/core/services/login.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  isLogged : boolean = false;
  destroyed$: Subject<boolean> = new Subject();

  constructor(
    private _loginService : LoginService,
  ) { }

  ngOnInit() {
    this._loginService.token$
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
