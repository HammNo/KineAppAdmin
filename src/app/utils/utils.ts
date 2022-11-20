
export default class Utils {
  static toFullDate(day : Date, time : string) : Date {
    const resultDate = new Date(day);
    const tSplited = time.split(':');
    resultDate.setHours(parseInt(tSplited[0]));
    resultDate.setMinutes(parseInt(tSplited[1]));
    return resultDate;
  }

  static compareDateToday(date : Date) : number{
    const toCompareDate : Date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayDate : Date = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    if(toCompareDate < todayDate) return -1;
    else if (toCompareDate == todayDate) return 0;
    return 1;
  }
}
