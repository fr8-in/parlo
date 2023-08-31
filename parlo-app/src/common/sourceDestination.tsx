import { green, red } from '@mui/material/colors'
import Badge from 'antd/lib/badge'
import React from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    /** source city name */
    source_name: string
    /** destination city name */
    destination_name: string
    customer_name?: string
    consignee_name?: string
    /** To align trip detail in one line */
    inline?: boolean
}

/**
 * SourceDestination trip source and destinamtion with badge component.
 * @returns React Component -> SourceDestination
 * */

export const SourceDestination: React.FC<Props> = ({
    className,
    source_name,
    destination_name,
    customer_name,
    consignee_name,
    inline,
    ...props
}) => {
    const _class = inline ? 'flex gap-3' : ''
    const source = source_name && customer_name ? `${source_name} - ${customer_name}` : source_name || customer_name
    const destination = destination_name && consignee_name ? `${destination_name} - ${consignee_name}` : destination_name || consignee_name
    
    return (
        <div className={className || '' + ' ' + _class} {...props}>
            <h6 className="flex items-center m-0 font-semibold truncate">
                <Badge color={green[600]} />
                &nbsp;
                {source}
            </h6>
            <h6 className="flex items-center m-0 font-semibold truncate">
                <Badge color={red[600]} />
                &nbsp;
                {destination}
            </h6>
        </div>
    )
}
