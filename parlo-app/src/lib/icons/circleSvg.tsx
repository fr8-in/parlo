import React from 'react'

const CircleSvg = (props:any) => {
    const { className } = props;
    const _class = className || "w-4 h-4";
    const { width, height } = props
    return (
        <svg className={_class}
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.7923" cy="10.6023" r="10.5" fill="#379BFF" />
            <path d="M17.1592 7.05567C16.7937 6.69127 16.2566 6.70205 15.906 7.08082L9.33248 14.1828L6.49984 11.3587C6.13434 10.9943 5.59727 11.0051 5.24668 11.3838C4.8961 11.7626 4.90728 12.32 5.27278 12.6844L8.74505 16.1462C8.9278 16.3284 9.10869 16.4177 9.37722 16.4123C9.64576 16.407 9.82292 16.3105 9.99821 16.1211L17.1853 8.35623C17.5359 7.97746 17.5247 7.42008 17.1592 7.05567Z" fill="white" />
        </svg>

    )
}
export default CircleSvg