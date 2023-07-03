import { EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useRef, useCallback, RefObject } from 'react';
import {useKeyPress} from '../lib/hooks';
import {useOnClickOutside} from '../lib/hooks';


interface InlineEditProps {
  onSetText: (text: string) => void;
  text: string;
  access?: boolean;
  length?: number;
  line_break?: boolean;
  maxWidth?: number;
  link?: string;
  minWidth?:number
}

/**
 * Inline editable component that allows editing of a text field when clicked.
 */
const InlineEdit = (props:InlineEditProps):any => {

  const { onSetText, text , length = 20, line_break, maxWidth, link , access = true , minWidth} = props;


  const [isInputActive, setIsInputActive] = useState(false);
  const [inputValue, setInputValue] = useState(text);
  const [width, setWidth] = useState(140);

  const wrapperRef: RefObject<HTMLSpanElement> = useRef(null);
  const textRef: RefObject<HTMLSpanElement> = useRef(null);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);

  const enter = useKeyPress('Enter');
  const esc = useKeyPress('Escape');

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      setInputValue(text);
      setIsInputActive(false);
    }
  });

  const onEnter = useCallback(() => {
    if (enter) {
      if (inputValue) {
        onSetText(inputValue);
        setIsInputActive(false);
      } else {
        onSetText(inputValue);
      }
    }
  }, [enter, inputValue, onSetText]);

  const onEsc = useCallback(() => {
    if (esc) {
      setInputValue(text);
      setIsInputActive(false);
    }
  }, [esc, text]);

  // get width of text element
  useEffect(() => {
    setWidth((prev) => (textRef.current ? textRef.current.clientWidth : prev));
  }, []);

  // focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) {
      inputRef.current?.focus();
    }
  }, [isInputActive]);

  // watch the Enter and Escape key presses
  useEffect(() => {
    if (isInputActive) {
      onEnter(); // if Enter is pressed, save the text and close the editor
      onEsc(); // if Escape is pressed, revert the text and close the editor
    }
  }, [onEnter, onEsc, isInputActive]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSpanClick = useCallback(() => setIsInputActive(true), []);

  return (
    access ? (
      <span className='inline-wrapper' ref={wrapperRef}>
        <span
          ref={textRef}
          onClick={handleSpanClick}
          className={`inline-text-copy ${line_break ? 'line-break' : 'ellipsis'} ${
            !isInputActive ? 'active' : 'hidden'
          }`}
        >
          {link || (text ? ((text.length > length) ? text.slice(0, length) + '...' : text) : '-')}
          <EditOutlined />
        </span>
        <input
          ref={inputRef}
          // set the width to the input length multiplied by the x height
          // it's not quite right but gets it close
          style={{ minWidth: minWidth ? minWidth : width , maxWidth : maxWidth ? maxWidth : width}}
          value={inputValue}
          onChange={handleInputChange}
          className={`inline-text-input ${
            isInputActive ? 'active' : 'hidden'
          }`}
        />
      </span>
    ) : (text || '-')
  );
};

export default InlineEdit;
