import array_functions from "./array_functions";
import common from "./common";
import cookie from "./cookie";
import date_moment from "./date_moment";
import employee from "./employee";
import geo from "./geo";
import limit from "./limit";
import local_storage from "./local_storage";
import math from "./math";
import message from "./message";
import typography from "./typography";
import url_share from "./url_share";
import validation from "./validation";

/**
 * Utility functions collection
 * @returns Util functions
 */

const util = {
  ...array_functions,
  ...common,
  ...cookie,
  ...date_moment,
  ...employee,
  ...geo,
  ...limit,
  ...local_storage,
  ...math,
  ...message,
  ...typography,
  ...url_share,
  ...validation,
};

export default util;
