
export default class Utils {
  static toFullDate(day : Date, time : string) : Date {
    const resultDate = new Date(day);
    const tSplited = time.split(':');
    resultDate.setHours(parseInt(tSplited[0]));
    resultDate.setMinutes(parseInt(tSplited[1]));
    return resultDate;
  }
}
