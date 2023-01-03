import { DayModel } from "./day.model";

export interface WeekModel{
  id : string;
  firstDay : Date;
  lastDay : Date;
  note? : string;
  isTemplate : boolean;
  days : DayModel [];
}

export interface WeekAddModel{
  dayOfModelWeek? : string;
  dayOfCreationWeek : string;
  note? : string;
}
