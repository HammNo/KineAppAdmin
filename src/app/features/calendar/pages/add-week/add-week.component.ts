import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Calendar } from '@fullcalendar/core';
import { FullCalendarElement } from '@fullcalendar/web-component';
import { ModalController } from '@ionic/angular';
import { ToastTemplatesService } from 'src/app/core/services/toast-templates.service';
import Utils from 'src/app/utils/utils';
import { WeekAddModel, WeekModel } from '../../models/week.model';
import { CalendarService } from '../../services/calendar.service';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-add-week',
  templateUrl: './add-week.component.html',
  styleUrls: ['./add-week.component.scss'],
})
export class AddWeekComponent {

  fg! : FormGroup;
  dayOfToAddWeek! : Date;
  templateWeeks! : WeekModel[];
  calendar!: Calendar;

  @ViewChild('modelWCalendar') calendarRef: ElementRef<FullCalendarElement>; //Required to get the calendar

  constructor(
    private _fb: FormBuilder,
    private _calendarSvc: CalendarService,
    private _modalCtrl: ModalController,
    private _toastTemplatesSvc : ToastTemplatesService,
  ) { }

  ionViewWillEnter(){
    this.initCalendar();
    this.fg = this._fb.group({
      modelWeek: [],
    });
    this._calendarSvc.getTemplateWeeks()
                      .subscribe({
                        next : (weeks) => {
                          this.templateWeeks = weeks;
                          this.renderSlotEvents(null);
                        }
                      });
    this.fg.get('modelWeek').valueChanges
                                  .subscribe((newValue : WeekModel) => {
                                    this.renderSlotEvents(newValue);
                                  });
  }

  submit(){
    if(this.fg.valid){
      const weekQuery : WeekAddModel = {
        dayOfCreationWeek : Utils.toISODate(this.dayOfToAddWeek)
      }
      if(this.fg.value.modelWeek){
        weekQuery.dayOfModelWeek = Utils.toISODate(new Date(this.fg.value.modelWeek.firstDay));
      }
      this._calendarSvc.addWeek(weekQuery)
                        .subscribe({
                          next : () => {
                            this._toastTemplatesSvc.weekAddSuccess();
                            this._calendarSvc.getWeek(this.dayOfToAddWeek).subscribe();
                          }
                        });
      this._modalCtrl.dismiss();
    }
  }

  initCalendar(){
    this.calendar = new Calendar(this.calendarRef.nativeElement, {
      plugins: [timeGridPlugin],
      initialView: 'timeGridWeek',
      locale: 'fr',
      height: '70%',
      dayHeaderFormat: {weekday : 'long'},
      allDaySlot: false,
      firstDay: 1, //Monday
      headerToolbar: false,
      events: [],
      dayCellDidMount: ({ date, el }) => {
        el.style.backgroundColor = '#86c5da';
      },
      slotMinTime: '08:00:00',
      slotMaxTime : '20:00:00'
    });
  }

  renderSlotEvents(week : WeekModel){
    this.calendar.removeAllEvents(); //Necessary, otherwise possible event duplication
    if(week != null){
      week.days.forEach((day) => {
        day.timeSlots.forEach((timeSlot) => {
          this.calendar.addEvent({
            start : Utils.toFullDate(day.date, timeSlot.startTime),
            end : Utils.toFullDate(day.date, timeSlot.endTime),
            slot : timeSlot,
            day : day.date
          });
        });
      });
    }
    this.calendar.render();
  }

  dismiss(){
    this._modalCtrl.dismiss();
  }
}
