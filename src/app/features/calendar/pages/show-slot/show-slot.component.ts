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

  getFrStatus() : string{
    switch (this.slot.status){
      case 0:
        return 'Libre';
      case 1 :
        return 'En attente de confirmation';
      default :
        return 'Réservé';
    }
  }

  dismiss(){
    this._modalCtrl.dismiss();
  }

}
