import Cookies from "js-cookie";
import { Buffer } from "buffer";

/**
 * Cookies related utility functions
 */
const cookie = {
  // Function to encrypt and set a cookie
  setEncryptCookies: (name: string, value: any) => {
    // Convert value to JSON string
    const jsonStr = JSON.stringify(value);
    // Encode the JSON string
    const encodedValue = Buffer.from(jsonStr).toString("base64");
    // Set the encrypted cookie with the given name
    Cookies.set(name, encodedValue);
  },
  // Function to get and decrypt a cookie
  getDecryptCookies: (name: string, server_cookie?: string) => {
    // Get the cookie value with the given name
    const cookieValue = Cookies.get(name) || server_cookie;
    // If the cookie value exists
    if (cookieValue) {
      // Decode the encrypted value
      const decodedValue = Buffer.from(cookieValue, "base64").toString("utf8");
      // Return the parsed JSON value
      return JSON.parse(decodedValue);
    }
    // If the cookie value does not exist, return {}
    else return {};
  },
  // Function to clear a cookie
  clearCookie: (name: string) => {
    // Remove the cookie with the given name
    Cookies.remove(name);
  },
  // Function to clear all cookies
  clearAllCookies: () => {
    Object.keys(Cookies.get()).forEach((cookie) => {
      Cookies.remove(cookie);
    });
  },
  startCookieListener: (callback:Function, key:string) => {
    let cookies = cookie.getDecryptCookies(key);
    setInterval(() => {
      const newCookies = cookie.getDecryptCookies(key);
      if (JSON.stringify(cookies) !== JSON.stringify(newCookies)) {
        cookies = newCookies;
        callback(newCookies);
      }
    }, 1000);
  },
 encryptAndDecrypt: (value = "", type: 'ENCRYPT' | 'DECRYPT') => {

    if (type !== "ENCRYPT" && type !== "DECRYPT") {
      console.error("Invalid encryption type");
      return null;
    }
  
    switch (type) {
      case "ENCRYPT":
        if (typeof value === "string") {
          return value;
        }
        const jsonStr = JSON.stringify(value);
        return Buffer.from(jsonStr).toString("base64");
      case "DECRYPT":
        if (typeof value === "string" && /^[a-zA-Z0-9+/]*={0,2}$/.test(value)) {
          try {
            const decoded = Buffer.from(value, "base64").toString("utf8");
            return JSON.parse(decoded);
          } catch (error) {
            return null;
          }
        }
        return value;
      default:
        break;
    }
  }
}

export  default cookie
