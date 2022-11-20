import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TimeSlotModel } from '../../models/timeSlot.model';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-show-slot',
  templateUrl: './show-slot.component.html',
  styleUrls: ['./show-slot.component.scss'],
})
export class ShowSlotComponent {

  slot! : TimeSlotModel;
  day! : Date;

  constructor(
    private _modalCtrl: ModalController,
    private _calendarSvc: CalendarService
  ) { }

  ionViewWillEnter(){
  }

  dismiss(){
    this._modalCtrl.dismiss();
  }

}
