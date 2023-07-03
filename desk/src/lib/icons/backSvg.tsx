import React from 'react'

const BackSvg = (props:any) => {
  const { className } = props;
  const _class = className || "w-5 h-5 fill-slate-500";
  return (
    <svg
      className={_class}
      viewBox="0 0 24 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.3314 2.73137C12.9562 2.10653 12.9562 1.09347 12.3314 0.468629C11.7065 -0.15621 10.6935 -0.15621 10.0686 0.468629L0.468629 10.0686C-0.15621 10.6935 -0.15621 11.7065 0.468629 12.3314L10.0686 21.9313C10.6935 22.5562 11.7065 22.5562 12.3314 21.9313C12.9562 21.3065 12.9562 20.2934 12.3314 19.6686L5.46291 12.8002H22.4C23.2837 12.8002 24 12.0838 24 11.2002C24 10.3165 23.2837 9.60016 22.4 9.60016H5.46256L12.3314 2.73137Z"
      />
    </svg>
  );
}

export default BackSvg