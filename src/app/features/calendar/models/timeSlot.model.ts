import { UserModel } from "src/app/core/models/user.model";
import { TimeSlotStatus } from "../enums/timeSlotStatus.enum";

export interface TimeSlotModel{
  id : string;
  startTime : string;
  endTime : string;
  note? : string;
  status : TimeSlotStatus;
  user? : UserModel;
}

export interface TimeSlotAddModel{
  date : Date;
  startTime : string;
  endTime : string;
}
