import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastTemplatesService } from 'src/app/core/services/toast-templates.service';
import { DayModel } from '../../models/day.model';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-edit-day',
  templateUrl: './edit-day.component.html',
  styleUrls: ['./edit-day.component.scss'],
})
export class EditDayComponent {

  fg! : FormGroup;
  day! : DayModel;

  constructor(
    private _fb: FormBuilder,
    private _modalCtrl: ModalController,
    private _calendarSvc: CalendarService,
    private _toastTemplatesSvc : ToastTemplatesService,
  ) { }

  ionViewWillEnter(){
    this.fg = this._fb.group({
      visible: [{value : this.day.visible, disabled : this.day.visible}, [Validators.required]],
      note: [null],
    });
  }

  submit(){
    if(!this.day.visible && this.fg.value.visible){
      this._calendarSvc.revealDay(this.day.id)
                        .subscribe({
                          next : () => {
                            this._toastTemplatesSvc.dayRevealSuccess();
                            this._calendarSvc.refreshWeek().subscribe();
                          }
                        });
    }
    this._modalCtrl.dismiss();
  }

  isValidForm(){
    if((!this.fg.controls['visible'].disabled && this.fg.value.visible) || this.fg.value.note != this.day.note){
      return true;
    }
    return false;
  }

  dismiss(){
    this._modalCtrl.dismiss();
  }
}
