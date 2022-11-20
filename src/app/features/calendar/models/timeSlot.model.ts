
export interface TimeSlotModel{
  id : string;
  startTime : string;
  endTime : string;
  note? : string;
  status : number;
}

export interface TimeSlotAddModel{
  date : Date;
  startTime : string;
  endTime : string;
}
