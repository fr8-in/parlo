/* eslint-disable camelcase */
import { Input, Space } from 'antd'
import { useEffect, useState } from 'react'
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons'
import { useShowHide } from '../lib/hooks/useShowHide'
import { colors } from '@mui/material'
import { EditAccess } from './editAccess'


interface EditableCellProps {
    label:string
    onSubmit:any
    width?:number
    edit_access?:boolean
    labelExtras?:boolean
    inputType?:string
    text?:string
    onChangeData?:Function
    showEditIcon?:boolean
}

/**
 * 
 * @param props refer EditableCellProps
 * @returns Jsx.Elemet EditableCell
 */
const EditableCell = (props:EditableCellProps) => {
  const { label, onSubmit, width, edit_access = true, labelExtras, inputType, text, onChangeData , showEditIcon = true } = props

  const initial = { edit: false }
  
  const handleScroll  = ({ target }:any) => {
    target.addEventListener(
      "wheel",
      (e: { preventDefault: () => void }) => {
        e.preventDefault();
      },
      { passive: false }
    );
  }

  useEffect(() => {
    setinputValue(label)
  }, [label])
  const { visible, onHide, onShow } = useShowHide(initial)
  const [inputValue, setinputValue] = useState(label)
  const onChange = (e:any) => {
    setinputValue(e.target.value)
      if (onChangeData) {
        onChangeData(e.target.value)
      }
  }

  const handleSubmit = () => {
    onSubmit(inputValue)
    onHide()
    setinputValue(label)
  }

  return (
    <div>
      {!visible.edit
        ? (
          <label>
            {label}{labelExtras ? labelExtras : ''}
            { showEditIcon ? <EditAccess disable={!edit_access} onEdit={() => onShow('edit')} /> : null }
          </label>)
        : (
          <span className='gap-1 flex flex-row'>
            <Input
              size='small'
              type={inputType || undefined}
              defaultValue={text ? text : label}
              style={{ width: width || '60%' }}
              onChange={onChange}
              onFocus={handleScroll}
            />
            <Space>
              <CheckCircleTwoTone onClick={handleSubmit} twoToneColor={colors.green[400]} />
              <CloseCircleTwoTone onClick={onHide} />
            </Space>
          </span>)}
    </div>
  )
}

export default EditableCell
