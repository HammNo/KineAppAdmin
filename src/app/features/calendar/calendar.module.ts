import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CalendarPageRoutingModule } from './calendar-routing.module';
import { CalendarPage } from './calendar.page';

@NgModule({
  imports: [
    CalendarPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    CalendarPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // Tells Angular we will have custom tags in our templates
})
export class CalendarPageModule {}
