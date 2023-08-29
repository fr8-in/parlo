/**
 * Geo location related utility functions
 * Part of `@fr8/helper` shared util
 * @author Karthikeyan M
 */
const geo = {
  /**
   * Swap latLong in to LongLat
   * @param truckLocation  Location point lat_long
   * @returns Long_Lat
   */
  swapLatLng: (truckLocation: string) => {
    const splitLocation = truckLocation.split(",")
    const longitude = splitLocation[1]
    const latitude = splitLocation[0]
    const truckLngLat = `${longitude},${latitude}`
    return truckLngLat
  },
  /**
   * Format Latlong string by removing (brackets)
   * @param point latlong point
   * @returns string as longLat
   */
  removeparenthesis: (point: string) => {
    const longitude = point.replace('(', '')
    const latitude = longitude.replace(')', '')
    return latitude
  },
  /**
   * Format Latlong string by removing (brackets)
   * @param point latlong point
   * @returns string as longlat
   */
  longitudelatitudeLocation: (location_geo: any) => {
    const splitLocation = location_geo.split(",")
    const latitude = splitLocation[0].replace('(', '')
    const longitude = splitLocation[1].replace(')', '')
    const reversedLocation = `${longitude},${latitude}`
    return reversedLocation
  },
  /**
   * Format longlat string by removing (brackets)
   * @param point longlat point
   * @returns string as Latlong
   */
  latitudelongitudeLocation: (location_geo: any) => {
    const splitLocation = location_geo.split(",")
    const latitude = splitLocation[1].replace(')', '')
    const longitude = splitLocation[0].replace('(', '')
    const reversedLocation = `${latitude},${longitude}`
    return reversedLocation
  },

}

export default geo