/**
 * All kinds of format validations related functions
 */
const validation = {
  /**
   * input text max length setter 
   * if the type is non text max length check not work 
   * these kind of case use this function at onChange event
   * @param e input event
   */
  handleLengthCheck: (e: { target: { value: string | any[]; maxLength: number } }) => {
    if (e.target.value.length > e.target.maxLength) {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  },
  /**
   * to validate the given mobile number has 10 digit
   * @param mobile valid mobile number
   * @returns boolean
   */
  validateMobileNo: (mobile: string) => {
    const reg = /^(\d{10})$/;
    return reg.test(mobile);
  },
  /**
   * get and input and return 10 digit mobile number 
   * if the fiven number more than 10 difit it removes begining charectors
   * @param number mobile numbers with or without 0/+91/91
   * @returns If it have 10 digit send 10 digit mobile number or as per the given numbers
   */
  phoneformater: (number: string) => {
    return number.replace(/\D/g, '').slice(-10)
  },
  /**
   * To validate the given pan format is valid
   * @param pan_number valid pan number
   * @returns boolean
   */
  validate_pan_format: (pan_number: string): boolean => {
    const pan = pan_number.replace(/\s/g, "");
    const regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    return pan.length === 10 ? regpan.test(pan) : false;
  },
  /**
   * To check the current userAgent is mobile
   * @todo we make sure or fix, it should work in non android devices
   * @returns boolean
   */
  isMobileDevice: () => {
    let details = navigator.userAgent;
    let regexp = /android/i;
    return regexp.test(details);
  },
  /**
   * To check the given vehicle number as per the indian vehicle standard format
   * @param value valid vehicle number
   * @todo if validate boolean required, we should add TruckValidation function
   * @returns error string
   */
  validateTruckNoFormat: (value: string) => {
    if (value.match(/[A-Z]{2}[0-9]{1,2}[A-Z0-9]{0,2}\d{4}$/i) === null) {
      return 'Required valid format eg: XX00XX0000'
    }
  },
  /**
   * To check the given GST number is as per Indian GST standard format
   * @param gst_number Valid GST number
   * @returns boolean
   */
  validate_gst_format: (gst_number: string): boolean => {
    const gst = gst_number.replace(/\s/g, "").toUpperCase();
    const regpan = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gst.length === 15 ? regpan.test(gst) : false;
  },
  /**
   * to check the given string have any special charector
   * @param name given name to test
   * @returns boolean
   */
  validate_special_characters: (name: string) => {
    const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    let matched_text = format.test(name)
    return matched_text
  },
  /**
   * to check the given string have special char and numbers
   * @param name given string to test
   * @returns boolean
   */
  validate_special_characters_and_number: (name: string) => {
    const format = /[!@#$%^&*()_+\-=0-9\[\]{};':"\\|,.<>\/?]+/;
    let matched_text = format.test(name)
    return matched_text
  }, 
  /**
   * to check the given string have special char and letters
   * @param name given string to test
   * @returns boolean
   */
  validate_special_characters_and_letter: (name: string) => {
    const format = /[!@#$%^&*()_+\-=a-zA-Z\[\]{};':"\\|,.<>\/?]+/;
    let matched_text = format.test(name)
    return matched_text
  },
  /**
   * to check, whether the given upi string is valid or not
   * @params upiId - valid upi string
   * @returns boolen 
   */
  validateUpi: (upiId: string): boolean => {
    const regex = /[a-zA-Z0-9_]{3,}@[a-zA-Z]{3,}/;
    return regex.test(upiId);
  },
  /**
   * To check the given aadhar string is valid
   * @param aadhar valid aadhar string
   * @returns boolean
   */
  validateAadhar: (aadhar: string) => {
    const regaadhar = /^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/
    const valid_aadhar = regaadhar.test(aadhar)
    return valid_aadhar
  },
  /**
   * to validated the given IFSC string is valid
   * @param ifsc_code valid IFSC string
   * @returns boolean
   */
  validate_ifsc_code: (ifsc_code: string) => {
    const ifscFormat = /^[A-Za-z]{4}\d{7}$/;
    let valid_ifsc = ifscFormat.test(ifsc_code)
    return valid_ifsc
  },
  /**
   * to check the value has only numbers
   * @param value  valid numbers 
   * @returns boolean
   */
  containsOnlyNumbers:(value:any) => {
    return /^[0-9]+$/.test(value);
  }
}

export default validation
