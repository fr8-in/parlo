import { Tooltip } from "antd"
import { ReactNode } from "react"

interface TitleAndLabelProps {
    title: string, label: string | number | ReactNode, index: number, className?: string
}

export const TitleAndLabel = (props: TitleAndLabelProps) => {
    const { title, label, index, className } = props
    return (
        <div className={`flex flex-col justify-between ${className ? className : ''} ${index !== 0 ? 'p-1 pl-2' : 'py-1'} w-full`} >
            <p className="text-[10px] font-medium text-slate-500 uppercase">{title}</p>
            {typeof label == 'string'
                ? (
                    <div>
                        <Tooltip title={label}>
                            <p className="font-normal truncate" >{label}</p>
                        </Tooltip>
                    </div>)
                : label}
        </div>
    )
}