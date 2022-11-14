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
import { LoginPage } from '../login/login.page';
import { Calendar } from '@fullcalendar/core';


defineFullCalendarElement();

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  host: { class: 'content-page' },
})
export class CalendarPage implements OnInit{

  calendar!: Calendar;

  @ViewChild('calendar') calendarRef: ElementRef<FullCalendarElement>; //Required to get the calendar

  @HostListener('window:resize') //Listener to adjust the number of days displayed depending the window size
  onResize() {
    this.calendar.changeView(this.getView());
  }

  constructor(
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(){
  }

  ionViewDidEnter(){
    this.calendar = new Calendar(this.calendarRef.nativeElement, {
      plugins: [timeGridPlugin],
      initialView: this.getView(),
      locale: 'fr',
      height: '100%',
      allDaySlot: false,
      firstDay: 1,
      headerToolbar: false,
      events: [
        {
          title: 'Test Event',
          date: '2022-11-14',
          start: '2022-11-14T12:30:00',
          end: '2022-11-14T13:00:00',
        },
        {
          title: 'Test Event 2',
          date: '2022-11-14',
          start: '2022-11-14T13:00:00',
          end: '2022-11-14T13:30:00',
        },
      ],
      eventClick: async (info) => await this.eventHandler(info),
      views: {
        timeGridThreeDays: {
          type: 'timeGrid',
          duration: { days: 3 },
        },
      },
      slotMinTime: '09:00:00',
      slotMaxTime : '20:00:00'
    });
    const interval = setInterval(() => {
      this.calendar.render();
      if(this.calendarRef.nativeElement.offsetHeight > 0){
        clearInterval(interval);
      }
    }, 50);

  }

  getView() : string{
    return window.innerWidth < 576 ? 'timeGridThreeDays' : 'timeGridWeek';
  }

  async eventHandler(infos : EventClickArg){
    const modal = await this.modalCtrl.create({
      component : LoginPage
    });
    modal.present();
  }
}
