import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-add-slot',
  templateUrl: './add-slot.component.html',
  styleUrls: ['./add-slot.component.scss'],
})
export class AddSlotComponent {

  fg! : FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _modalCtrl: ModalController,
    private _calendarSvc: CalendarService
  ) { }

  ionViewWillEnter(){
    this.fg = this._fb.group({
      date: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime: [null, [Validators.required]]
    });
  }

  submit(){
    const newSlot = {
      date : this.fg.value.date,
      startTime : this.fg.value.startTime + ':00',
      endTime : this.fg.value.endTime + ':00'
    }
    this._calendarSvc.addSlot(newSlot).subscribe({
                                        next : () => {
                                          this._calendarSvc.getWeek(new Date()).subscribe();
                                        },
                                        error : (err) => {

                                        }
    });
    this._modalCtrl.dismiss();
  }

  dismiss(){
    this._modalCtrl.dismiss();
  }
}
