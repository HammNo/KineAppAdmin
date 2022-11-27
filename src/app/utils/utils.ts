
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
    else if (toCompareDate.getFullYear() == todayDate.getFullYear()
              && toCompareDate.getMonth() == todayDate.getMonth()
              && toCompareDate.getDate() == todayDate.getDate()) return 0;
    return 1;
  }

  static toISODate(date : Date) : string{
    let strDate = date.getFullYear() + '-';
    const strMonth = date.getMonth() + 1;
    if(strMonth < 10) strDate += '0';
    strDate += strMonth + '-';
    const strDay = date.getDate();
    if(strDay < 10) strDate += '0';
    strDate += strDay;
    return strDate;
  }
}
