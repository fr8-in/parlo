import static_names from "./static_names";
import date_time from "./date_time";
import truck from "./truck";
import employee from "./employee";
import urls from "./urls";
import indent from "./indent";
import trip from "./trip";

/**
 * Constants for applicartion modules
 * Aviod using magic numbers and static string/array/object
 * Keep all your constants in related modules
 */
const constants = {
  ...date_time,
  ...employee,
  ...indent,
  ...static_names,
  ...truck,
  ...urls,
  ...trip
}

export default constants;