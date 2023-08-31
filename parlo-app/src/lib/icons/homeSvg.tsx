import React from 'react'

const HomeSvg = (props:any) => {
    const { className } = props;
    const _class = className || "w-4 h-4";
    const { width, height } = props
    return (
        <svg
            className={_class}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5592" cy="11.3955" r="10.5" fill="#3FBE4C" />
            <path d="M8.86907 16.5047V12.2736H11.6898V16.5047H15.2157V10.8632H17.3313L10.2794 4.5166L3.22762 10.8632H5.34316V16.5047H8.86907Z" fill="white" />
        </svg>

    )
}

export default HomeSvg