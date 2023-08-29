import { useEffect, useState } from 'react';

/**
 * A custom React hook to debounce a value and get the debounced value.
 *
 * @author Prasanth.M
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The delay in milliseconds for debouncing the value.
 * @returns {T} The debounced value.
 *
 * @example
 * // Basic usage with default delay (500ms)
 * const [inputValue, setInputValue] = useState('');
 * const debouncedValue = useDebounce(inputValue);
 *
 * // Usage with custom delay (300ms)
 * const [inputValue, setInputValue] = useState('');
 * const debouncedValue = useDebounce(inputValue, 300);
 *
 * // Usage with a complex object and custom delay (1000ms)
 * const [userData, setUserData] = useState({ name: '', email: '' });
 * const debouncedUserData = useDebounce(userData, 1000);
 * 
 * //Finally use useEffect to call your function.
 * useEffect(()=>{
 * yourCallBackFunction() / queryCall()
 * },[debouncedValue])
 */
export function useDebounce<T>(value: T, delay?: number): T {
  // State to hold the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // Clean up the timer when the component unmounts or when the value/delay changes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  // Return the debounced value to the component
  return debouncedValue;
}
