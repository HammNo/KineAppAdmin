import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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
    const params = new HttpParams();
    params.append('firstDayOfRefWeek', dayOfWeek.toString());
    return this._http.get<WeekModel>(environment.base_url + '/week', {params})
      .pipe(
        tap(response => {
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
    console.log(newSlot);
    return this._http.post<any>(environment.base_url + '/timeSlot', newSlot);
  }
}
