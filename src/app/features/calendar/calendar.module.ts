import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarPage } from './calendar.page';
import { AddSlotComponent } from './pages/add-slot/add-slot.component';

@NgModule({
  imports: [
    CalendarPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    CalendarPage,
    AddSlotComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Tells Angular we will have custom tags in our templates
})
export class CalendarPageModule {}
