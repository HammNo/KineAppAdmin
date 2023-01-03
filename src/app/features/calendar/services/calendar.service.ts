import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import Utils from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import { TimeSlotAddModel } from '../models/timeSlot.model';
import { WeekAddModel, WeekModel } from '../models/week.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  currentWeek$: BehaviorSubject<WeekModel|null> = new BehaviorSubject<WeekModel|null>(null);

  constructor(
    private _http: HttpClient
  ) { }

  getWeek(dayOfTargetWeek? : Date) : Observable<WeekModel>{
    const queryParams = new HttpParams().append('dayOfTargetWeek', (dayOfTargetWeek == null)? null : Utils.toISODate(dayOfTargetWeek));
    return this._http.get<WeekModel>(environment.base_url + '/week', {params:queryParams})
      .pipe(
        tap(response => {
          this.currentWeek$.next(response);
        }),
        catchError(err =>{
          this.currentWeek$.next(null);
          throw err.error;
        })
    );
  }

  addWeek(weekQuery : WeekAddModel) : Observable<any>{
    console.log(weekQuery)
    return this._http.post<any>(environment.base_url + '/week', weekQuery)
  }

  refreshWeek() : Observable<WeekModel>{
    return this.getWeek(new Date(this.currentWeek$.value.firstDay));
  }

  addSlot(newSlot : TimeSlotAddModel) : Observable<any>{
    return this._http.post<any>(environment.base_url + '/timeSlot', newSlot);
  }

  revealDay(id : string) : Observable<any>{
    return this._http.patch<any>(environment.base_url + '/day/' + id +'/reveal', null);
  }

  switchWTemplateState(id : string) : Observable<any>{
    return this._http.patch<any>(environment.base_url + '/week/' + id +'/switchTemplate', null);
  }

  getTemplateWeeks(): Observable<WeekModel[]> {
    return this._http.get<WeekModel[]>(environment.base_url + '/week/getTemplates')
  }
}
