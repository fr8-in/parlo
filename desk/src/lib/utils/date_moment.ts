import moment, { Moment } from "moment";
import constants from "../constants";

const { DDMMMYY, YYYYMMDDHHmm,DDMMYYHHmmss } = constants
const fr8Date = moment().add(1, "days")

/**
 * Date and time related utility functions
 * @author Karthikeyan M
 */

const date_moment = {
  /** Format date with Moment
   * @param date: string
   * @param format: stirng
   * @returns Date string by given format
   */
  formatDate: (date: string, format?: string) => {
    return date ? moment(date).format(format || DDMMMYY) : "-";
  },
  /**
   * Get difference between given date and now
   * @param date 
   * @returns hours in number
   */
  getHours: (date: any) => {
    const now = moment(date_moment.now);
    const created_at = moment(date);
    const diffDuration = now.diff(created_at, 'hours');
    return diffDuration || 0;
  },
  /** Returns today date ISO format utc+5:30 with given string format
   *  @returns Today ISO
   */
  current_day: (format?: string) => moment().utcOffset("+05:30").format(format || DDMMMYY),
  /** Returns today date ISO format utc+5:30
   *  @returns Current ISO datetime string
   */
  now: moment().utcOffset("+05:30").format(YYYYMMDDHHmm),
  /** Returns today date ISO format utc+5:30
   *  @var Date in YYYY-MM-DD format
   */
  current: moment().utcOffset("+05:30").format(DDMMYYHHmmss),
  /** Returns today date ISO format utc+5:30
   *  @var Date in YYYY-MM-DD format
   */
  today: moment().utcOffset("+05:30").format("YYYY-MM-DD"),
  /** Returns today date ISO format utc+5:30
   *  @var Date in YYYY-MM-DD HH:mm format
   */
  nth_future_day: (nthDay: number, format?: string) => moment().add(nthDay, 'd').format(format || DDMMMYY),
  /** Returns get past day by given nth day
    *  @param nthDay number
    *  @param format valid date format string
    *  @var Date in YYYY-MM-DD HH:mm format
    */
  nth_past_day: (nthDay: number, format?: string) => moment().subtract(nthDay, 'd').format(format || DDMMMYY),
  week_value: moment(fr8Date).format("WW"),
  /** Return Month number
   *  @var Monthnumber in M format
   */
  month_value: moment(fr8Date).format("M"),
  /** Return Month name
   *  @var Monthnumber in MMMM format
   */
  month_name: moment(fr8Date).format("MMMM"),
  /** Return Year number
   *  @var Monthnumber in YYYY format
   */
  year_value: moment(fr8Date).format("YYYY"),
  /**
   * Detemines given date as per ERP date standard
   * @param date 
   * @returns date string
   */
  epr_date_time: (date:Moment) => moment(date).format(YYYYMMDDHHmm)
}

export default date_moment