import isEmpty from 'lodash/isEmpty'

/**
 * Array operation related utility functions
 */
const array_functions = {
  /** 
   * Send seach text to search from given array for any given key from the object 
   * @param text - string to search
   * @param arrayOfData - Array of objects
   * @param key - object key name to be search
  */
  searchFromArray: (text: string, arrayOfData: Array<any>, key: string) => {
    const toLower = text ? text.toLowerCase() : ''
    return ((toLower.length > 0) ? arrayOfData.filter((_data) => _data[key] ? _data[key].toLowerCase().includes(toLower) : false) : [])
  },
  /** 
   * City list for select component
   * @param cities - array of city object
   * @returns array of city as {label, value} pair
  */
  citySearchResult: (cities: Array<any>) => {
    return cities.map((city => ({ label: `${city.city || city.name}, ${city.state}`, value: city.id })))
  },
  /**
   * Find min value from given array[number]
   * @param arr - array[number]
   * @returns minimum number from array
   */
  arrMin: (arr: number[]): number | null => !isEmpty(arr) ? +Math.min(...arr).toFixed(0) : null,
  /**
   * Find max value from given array[number]
   * @param arr - array[number]
   * @returns maximim number from array
   */
  arrMax: (arr: number[]): number | null => !isEmpty(arr) ? +Math.max(...arr).toFixed(0) : null,
  /**
   * Find sum from given array[number]
   * @param arr - array[number]
   * @returns sum of given array
   */
  arrSum: (arr: number[]) => arr.reduce((a, b) => a + b, 0),
  /**
   * Find average from given array[number]
   * @param arr - array[number]
   * @returns average of given array
   */
  arrAvg: (arr: number[]): number | null => !isEmpty(arr) ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(0) : null,
  /**
   * Get n number of random item from the given array
   * @param arr - array of (objects | items)
   * @param n - required items from given item
   * @returns n number of random items from array
   */
  getRandom: (arr:Array<any>, n:number) => {
    let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  },
  /**
   * Remove duplicate items from array
   * @param arr array of items with duplicate
   * @param prop key name to identify the duplicate
   * @returns Duplicate removed array
   */
  removeDuplicates: (arr:Array<any>, prop:string) => {
    return arr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  },
  
}

export default array_functions
