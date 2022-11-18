import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  defineFullCalendarElement,
  EventClickArg,
  FullCalendarElement,
} from '@fullcalendar/web-component';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ModalController } from '@ionic/angular';
import { HostListener } from '@angular/core';
import { Calendar } from '@fullcalendar/core';
import { CalendarService } from './services/calendar.service';
import { WeekModel } from './models/week.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import utils from 'src/app/utils/utils';
import { AddSlotComponent } from './pages/add-slot/add-slot.component';

defineFullCalendarElement();

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  host: { class: 'content-page' },
})
export class CalendarPage{

  calendar!: Calendar;
  destroyed$: Subject<boolean> = new Subject();
  events! : any[];

  @ViewChild('calendar') calendarRef: ElementRef<FullCalendarElement>; //Required to get the calendar

  @HostListener('window:resize') //Listener to adjust the number of days displayed depending the window size
  onResize() {
    this.calendar.changeView(window.innerWidth < 576 ? 'timeGridThreeDays' : 'timeGridWeek');
  }

  constructor(
    private _modalCtrl: ModalController,
    private _calendarSvc : CalendarService
  ) {}

  ionViewDidEnter(){
    this.initCalendar();
    this.tryRenderCalendar();
    this._calendarSvc.currentWeek$
                      .pipe(takeUntil(this.destroyed$))
                      .subscribe(week => {
                        if(week != null){
                          this.renderTSEvents(week);
                        }
                      });
    this._calendarSvc.getWeek(new Date()).subscribe();
  }

  initCalendar(){
    this.calendar = new Calendar(this.calendarRef.nativeElement, {
      plugins: [timeGridPlugin],
      initialView: window.innerWidth < 576 ? 'timeGridThreeDays' : 'timeGridWeek',
      locale: 'fr',
      height: '100%',
      allDaySlot: false,
      firstDay: 1, //Monday
      headerToolbar: false,
      events: [],
      eventClick: async (info) => await this.eventHandler(info),
      views: {
        timeGridThreeDays: {
          type: 'timeGrid',
          duration: { days: 3 },
        },
      },
      slotMinTime: '08:00:00',
      slotMaxTime : '20:00:00'
    });
  }

  tryRenderCalendar(){
    const interval = setInterval(() => { //Make sure the calendar is well rendered
      this.calendar.render();
      if(this.calendarRef.nativeElement.offsetHeight > 0){
        clearInterval(interval);
      }
    }, 50);
  }

  renderTSEvents(week : WeekModel){
    this.calendar.removeAllEvents();
    week.days.forEach((day) => {
      day.timeSlots.forEach((timeSlot) => {
        this.calendar.addEvent({
          start : utils.toFullDate(day.date, timeSlot.startTime),
          end : utils.toFullDate(day.date, timeSlot.endTime)
        });
      });
    });
  }

  async eventHandler(infos : EventClickArg){
    // const modal = await this._modalCtrl.create({
    // });
    // modal.present();
  }

  async addSlot(){
    const modal = await this._modalCtrl.create({
      component : AddSlotComponent,
      cssClass : 'add-modal'
    });
    modal.present();
  }

  ionViewDidLeave() { // OnDestroy's ionic equivalent
    this.destroyed$.next(false);
    this.destroyed$.complete();
    this.calendar.destroy();
  }

  //Web Worker
}
