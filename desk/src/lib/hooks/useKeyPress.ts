import { useState, useEffect } from 'react';

/**
 * Hook that tracks whether a specific key is currently being pressed.
 * @param targetKey The key to track.
 * @param keyDownFunction Function that nees to be executed when a key is pressed.
 * @returns A boolean value indicating whether the key is currently pressed.
 */
export const useKeyPress = (targetKey: string , keyDownFunction?:Function): boolean => {
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  const downHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(true);
      if(keyDownFunction){
        keyDownFunction()
      }
    }
  };

  // If released key is our target key then set to false
  const upHandler = ({ key }: KeyboardEvent) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
};
