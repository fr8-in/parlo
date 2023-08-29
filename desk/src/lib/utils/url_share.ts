import constants from "../constants";

/**
 * Share, links and call related functions
 */
const url_share = {
  /**
   * Open an external URL 
   * @param url string
   * @returns window open with _blank tab
   */
  openExternalUrl: (url: string) => window.open(url, '_blank'),
  /**
   * WhatsApp share by given message to any desiered mobile number
   * @param formatted_msg message to share
   * @param mobile message recevier mobile number
   */
  onShare: (formatted_msg: string, mobile: string) => {
    let url = `${constants.whats_app_chat_url}send?phone=${mobile}&text=${encodeURI(formatted_msg)}&app_absent=0`;
    window.open(url, '_blank');
  },
  /**
   * WhatsApp share by given message to any mobile number that selected externally
   * @param formatted_msg message to share
   */
  onShareMessage: async (formatted_msg:string) => {
    let url = `https://wa.me/?`;
    url += `text=${encodeURI(formatted_msg)}&app_absent=0`;
    await window.open(url);
  },
  /**
  * Formats a given mobile number in the required format for making a phone call in India.
  * The final call number should contain only 10 digits plus "+91".
  * If the number contains prefix zero, it will be removed.
  * If the number already contains "+91", no changes will be made.
  * If the number length is greater than 10 and contains "91" as a prefix, "91" will be removed and "+91" will be added.
  * If the number is less than 10 digits, the function will not trigger the phone call.
  *
  * @param mobileNo - Mobile Number to make call.
  * @returns Triggers call activity only if the number is in valid format -> "tel:+91xxxxxxxxxx".
  */
  callNow:(mobileNo: string) => {
    const regexPattern = /^(\+?91)?(\d{10})$/;
    if (mobileNo && mobileNo.startsWith("0")) {
    mobileNo = mobileNo.slice(1);
    }
    if (regexPattern.test(mobileNo)) {
    const formattedMobileNo = "+91" + mobileNo.replace(/^(\+?91)?(\d{10})$/, "$2");
    window.location.href = "tel:" + formattedMobileNo;
    }
}
}

export default url_share