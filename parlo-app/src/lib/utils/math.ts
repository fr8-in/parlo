import moment from "moment"

const math = {
  /**
   * Get K,L,C formated numbers
   * @param n number want to format
   * @returns formated number
   */
  formatCash: (n: number) => {
    if (n < 1e3) return n
    if (n >= 1e3 && n < 1e5) return +(n / 1e3).toFixed(1) + 'K'
    if (n >= 1e5 && n <= 1e7) return +(n / 1e5).toFixed(1) + 'L'
    if (n >= 1e7 && n <= 1e9) return +(n / 1e7).toFixed(1) + 'C'
  },
  /**
   * get number in Lakhs format (L)
   * @param n number want to format
   * @returns formated number in Lakhs
   */
  cashToLakhs: (n: number) => (n ? (n / 1e5).toFixed(2) + 'L' : '0L'),
  /**
   * Get math operated value
   * @param v1 operand 1
   * @param v2 operand 2
   * @param type Operator -> 'sum' | 'subtract' | 'multiplay' | 'divide' | 'percentage'
   * @returns Math processed value
   */
  mathCalc: (v1: string, v2: string, type: 'sum' | 'subtract' | 'multiplay' | 'divide' | 'percentage'): string | undefined => { // Use only if value came from form field
    const value1 = (!v1 || v1 === '') ? 0 : +v1
    const value2 = (!v2 || v2 === '') ? 0 : +v2

    if (type === 'sum') { 
      return (value1 + value2).toString() 
    }
    if (type === 'subtract') {
      const result = (value1 - value2)
      return result < 1 ? '0' : result.toString() // negative value changing to 0
    }
    if (type === 'multiplay') {
      return (value1 * (value2 || 1)).toString()
    }
    if (type === 'divide') {
      return (value1 && value2) ? (value1 / value2).toString() : '0'
    }
    if (type === 'percentage') {
      return (!value1) ? '0' : Math.ceil((value1 * value2) / 100).toString()
    }
  },
  calculate_tat: (created_at: any) => {
    const created_day = moment(created_at)
      .utcOffset("+05:30")
      .format("YYYY-MM-DD");
    return moment(Date.now()).diff(moment(created_day), "days");
  },
  calculate_tat_hours: (created_at: any) => {
    const created_time = moment(created_at, "YYYY-MM-DDTHH:mm:ss");
    const current_time = moment();
    return current_time.diff(created_time, "hours");
  },
}

export default math
