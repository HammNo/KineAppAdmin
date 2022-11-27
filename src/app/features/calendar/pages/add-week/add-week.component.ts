import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ToastTemplatesService } from 'src/app/core/services/toast-templates.service';
import Utils from 'src/app/utils/utils';
import { WeekAddModel } from '../../models/week.model';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-add-week',
  templateUrl: './add-week.component.html',
  styleUrls: ['./add-week.component.scss'],
})
export class AddWeekComponent {

  fg! : FormGroup;
  dayOfToAddWeek! : Date;

  constructor(
    private _fb: FormBuilder,
    private _calendarSvc: CalendarService,
    private _modalCtrl: ModalController,
    private _toastTemplatesSvc : ToastTemplatesService,
  ) { }

  ionViewWillEnter(){
    this.fg = this._fb.group({
      dayOfModelWeek: [null],
    });
  }

  submit(){
    if(this.fg.valid){
      const weekQuery : WeekAddModel = {
        dayOfCreationWeek : Utils.toISODate(this.dayOfToAddWeek)
      }
      if(this.fg.value.dayOfModelWeek){
        weekQuery.dayOfModelWeek = Utils.toISODate(new Date(this.fg.value.dayOfModelWeek));
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

  dismiss(){
    this._modalCtrl.dismiss();
  }
}
