/**
 * Text manipulation and format composer functions
 */
const typography = {
  /** Pass any string and show first letter as avatar 
   * max two letter from first two word
   * @param name: string
  */
  avatar: (name: string) =>
    name
      ? name
        .split(" ")
        .map((n, i) => (i < 2 ? n[0] : ""))
        .join("")
        .toUpperCase()
      : "U",
  /**
   * Capitalize first letter
   * @param string 
   * @returns string
   */
  camalize: (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  /**
   * generate random number in given min max range
   * @param min min value starts with
   * @param max max value starts with
   * @param decimalPlaces determines number of decimals required
   * @returns generated random value with in range 
   */
  genRand: (min: number, max: number, decimalPlaces: number) => {
    const rand = Math.random() * (max - min) + min;
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  },
  /**
   * Determine truncated value
   * @param data string to truncate
   * @param length length to truncate
   * @returns truncated string
   */
  truncate: (data: string, length: number) => {
    return (data && data.length > length) ? data.slice(0, length) + "..." : data
  } ,
  /**
   * Format city and state name
   * @param city city object
   * @returns formated city name
   */
  formatCity: (city:any) => city ? `${city?.name}, ${city?.stateName || city?.state_name}` : null,
  /**
   * To remove First word from given sentence
   * @param str 
   * @returns 
   */
  removeFirstWord: (str:string):string => {
    const indexOfSpace = str.indexOf(' ');
    if (indexOfSpace === -1) {
      return '';
    }
    return str.substring(indexOfSpace + 1);
  },
  /**
   * Copy given text to clipboard
   * @param text string
   */
  copyText: (text: string) => {
    navigator.clipboard.writeText(text)
  },
}

export default typography