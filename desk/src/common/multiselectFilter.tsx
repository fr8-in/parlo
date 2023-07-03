import { Checkbox, Divider } from 'antd'
import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import { Button } from '@mui/material'

interface PropsType {
    options: any,
    value: Array<any> | any,
    handleFilterChange: any,
    key_name: string
}

const MultiSelectFilter = (props: PropsType) => {
    const { options, value, handleFilterChange, key_name } = props
    const [filter, setFilter] = useState(value)
console.log({props})    
const optionLength = options.length
    const valueLength = value && Array.isArray(value) ? value.length : 0
    const [all, setAll] = useState(!isEmpty(value) && (optionLength === valueLength))

    const handleFilterCheck = (checked: any) => {
        const all = (checked && checked.length === optionLength ? true : false)
        setAll(all)
        setFilter(checked)
    }
    const handleCheckAll = (e: any) => {
        const data = options.map((data: any) => data['value'])
        setAll(e.target.checked)
        setFilter(e.target.checked ? data : [])
    }

    return (
        <>
            <div className='scroll-box'>
                <Checkbox.Group
                    options={options}
                    value={filter}
                    onChange={handleFilterCheck}
                    className='filter-drop-down'
                />
            </div>
            <Divider className='my-1' />
            <div className='flex justify-between items-center p-2'>
                <Checkbox
                    onClick={handleCheckAll}
                    checked={all}>All</Checkbox>
                <Button size='small' onClick={() => handleFilterChange(filter, key_name)}>OK</Button>
            </div>
        </>
    )
}

export default MultiSelectFilter
