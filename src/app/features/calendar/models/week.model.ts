import { DayModel } from "./day.model";

export interface WeekModel{
  id : number;
  firstDay : Date;
  lastDay : Date;
  note? : string;
  days : DayModel [];
}
