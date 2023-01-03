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
import { DayModel } from './models/day.model';
import { EditDayComponent } from './pages/edit-day/edit-day.component';
import { ShowSlotComponent } from './pages/show-slot/show-slot.component';
import { TimeSlotModel } from './models/timeSlot.model';
import Utils from 'src/app/utils/utils';
import { ToastTemplatesService } from 'src/app/core/services/toast-templates.service';
import { AddWeekComponent } from './pages/add-week/add-week.component';

defineFullCalendarElement();

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  host: { class: 'content-page' },
})
export class CalendarPage{

  localWeek? : WeekModel;
  calendar!: Calendar;
  calendarDays! : {date : Date, el : HTMLElement}[];
  destroyed$: Subject<boolean> = new Subject();

  @ViewChild('calendar') calendarRef: ElementRef<FullCalendarElement>; //Required to get the calendar

  @HostListener('window:resize') //Listener to adjust the number of days displayed depending the window size
  onResize() {
    this.calendar.changeView(window.innerWidth < 576 ? 'timeGridThreeDays' : 'timeGridWeek');
  }

  constructor(
    private _modalCtrl: ModalController,
    private _calendarSvc : CalendarService,
    private _toastTemplatesSvc : ToastTemplatesService,
  ) {}

  ionViewDidEnter(){
    this.calendarDays = [];
    this.initCalendar();
    this._calendarSvc.currentWeek$
                      .pipe(takeUntil(this.destroyed$))
                      .subscribe({
                        next : (week) => {
                          this.localWeek = week;
                          this.calendarDays.forEach((cd) => this.renderDayBackground(cd.date, cd.el));
                          this.renderSlotEvents();
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
      navLinks: true,
      navLinkDayClick: async (date) => await this.dayHeaderHandler(date),
      dayCellDidMount: ({ date, el }) => {
        if(this.calendarDays.length > 6) this.calendarDays = []; //Because dayCellDidMount is triggered each time the calendar is refreshed (ex : week change)
        this.calendarDays.push({date, el});
      },
      eventClick: async (info) => await this.slotEventHandler(info),
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

  renderSlotEvents(){
    this.calendar.removeAllEvents(); //Necessary, otherwise possible event duplication
    if(this.localWeek != null){
      this.localWeek.days.forEach((day) => {
        day.timeSlots.forEach((timeSlot) => {
          this.calendar.addEvent({
            start : utils.toFullDate(day.date, timeSlot.startTime),
            end : utils.toFullDate(day.date, timeSlot.endTime),
            slot : timeSlot,
            day : day.date
          });
        });
      });
    }
    this.calendar.render();
  }

  renderDayBackground(date : Date, el : HTMLElement){
    if(Utils.compareDateToday(date) < 0){
      el.style.backgroundColor = '#bababa';
      return;
    }
    if(this.localWeek == null){
      return;
    }
    if(Utils.compareDateToday(date) == 0){
      el.style.backgroundColor = '#F1E5AC';
      return;
    }
    const day : DayModel = this.localWeek.days.find(d => new Date(d.date).getDate() == date.getDate());
    if(!day){
      el.style.backgroundColor = '#86c5da';
      return;
    }
    if(day.visible){
      el.style.backgroundColor = '#a9d5a9';
    }
    else{
      el.style.backgroundColor = '#ff7f7f';
    }
  }

  async slotEventHandler(infos : EventClickArg){
    const localSlot : TimeSlotModel = infos.event.extendedProps.slot;
    if (!localSlot) return;
    const modal = await this._modalCtrl.create({
      component : ShowSlotComponent,
      cssClass : 'show-slot-modal',
      componentProps : {
        slot : localSlot,
        day : infos.event.extendedProps.day
      }
    });
    modal.present();
  }

  async addSlotHandler(){
    const modal = await this._modalCtrl.create({
      component : AddSlotComponent,
      cssClass : 'addTSlot-modal'
    });
    modal.present();
  }

  async addWeekHandler(){
    const modal = await this._modalCtrl.create({
      component : AddWeekComponent,
      cssClass : 'addWeek-modal',
      componentProps : {
        dayOfToAddWeek : this.calendar.getDate()
      }
    });
    modal.present();
  }

  async dayHeaderHandler(date : Date){
    if(Utils.compareDateToday(date) < 0) return;
    const localday : DayModel = this.localWeek.days.find(d => new Date(d.date).getDate() == date.getDate());
    if(!localday) return;
    const modal = await this._modalCtrl.create({
      component : EditDayComponent,
      cssClass : 'edit-day-modal',
      componentProps : {
        day : localday
      }
    });
    modal.present();
  }

  changeWeek(offset : number){
    if(offset > 0) this.calendar.next();
    else this.calendar.prev();
    this._calendarSvc.getWeek(this.calendar.getDate())
                        .subscribe({
                          next : () => {},
                          error : (err) => {
                            this._toastTemplatesSvc.getWeekFail();
                          }
                        });
  }

  switchTemplateState(){
    this._calendarSvc.switchWTemplateState(this.localWeek.id)
                        .subscribe({
                          next : () => {
                            this._calendarSvc.refreshWeek().subscribe();
                          },
                          error : (err) => {
                          }
                        });
  }

  ionViewDidLeave() { // OnDestroy's ionic equivalent
    this.destroyed$.next(false);
    this.destroyed$.complete();
    this.calendar.destroy();
  }
}
