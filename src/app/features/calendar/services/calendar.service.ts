import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DayModel } from '../models/day.model';
import { TimeSlotAddModel } from '../models/timeSlot.model';
import { WeekModel } from '../models/week.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  currentWeek$: BehaviorSubject<WeekModel|null> = new BehaviorSubject<WeekModel|null>(null);

  constructor(
    private _http: HttpClient
  ) { }

  getWeek(dayOfWeek : Date) : Observable<WeekModel>{
    const correctFormatDate = dayOfWeek.getFullYear() + '-' + (dayOfWeek.getMonth() + 1) + '-' + dayOfWeek.getDate()
    const queryParams = new HttpParams().append('firstDayOfRefWeek', correctFormatDate);
    return this._http.get<WeekModel>(environment.base_url + '/week', {params:queryParams})
      .pipe(
        tap(response => {
          console.log('par ici');
          console.log(response);
          this.currentWeek$.next(response);
        }),
        catchError(err =>{
          console.log(err.error);
          throw err.error;
        })
    );
  }

  addSlot(newSlot : TimeSlotAddModel) : Observable<any>{
    return this._http.post<any>(environment.base_url + '/timeSlot', newSlot);
  }

  revealDay(id : string){
    return this._http.patch<any>(environment.base_url + '/day/' + id +'/reveal', null);
  }
}
