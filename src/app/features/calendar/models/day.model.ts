import { TimeSlotModel } from "./timeSlot.model";

export interface DayModel{
  id : number;
  date : Date;
  note? : string;
  visible : boolean;
  timeSlots : TimeSlotModel [];
}
