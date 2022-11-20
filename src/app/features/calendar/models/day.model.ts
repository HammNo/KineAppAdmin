import { TimeSlotModel } from "./timeSlot.model";

export interface DayModel{
  id : string;
  date : Date;
  note? : string;
  visible : boolean;
  timeSlots : TimeSlotModel [];
}
