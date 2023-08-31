/**
 * LocalStroage related utility functions
 */
const local_storage = {
  /**
   * Get token stored in localsorage
   * @returns sored token string
   */
  getToken: async () => {
    try {
      const token = localStorage.getItem("token");
      return token;
    } catch (e) {
      return null;
    }
  },
  /**
   * Determines create local storage with expiry
   * @param key string
   * @param value stringified object or and array or any primitives
   * @param ttl time till expire in number
   */
  setWithExpiry: (key: string, value: any, ttl: any) => {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },
  /**
   * Get item if the item doesn't expire
   * @param key key name stored in localstorage
   * @returns Stored value | null
   */
  getWithExpiry: (key: string) => {
    const itemStr = localStorage.getItem(key) || null;
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  },
  /**
   * get any key value stored in local storage
   * @param name key name want to get
   * @returns Stored value | null
   */
  getLocalStorage: (name: string) => {
    try {
      const item = localStorage.getItem(name)
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.log(`Failed to fetch the item ${name}`, e);
      return null
    }
  },
}

export default local_storage