import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { FC } from 'react'

interface Props { 
    onEdit:()=>void,
     lock?:boolean, 
     disable?:boolean, 
     size?:"large" | "middle" | "small" }

/**
 * 
 * @param props 
 * @returns Jsx.Element EditAccess
 */
export const EditAccess:FC<Props> = (props) =>{
  const { onEdit, lock, disable, size = 'small' } = props

  return (
    <>
      {!lock
        ? (
          <Button onClick={onEdit} type='link' size={size} disabled={disable} icon={<EditOutlined />} />)
        : null}
    </>
  )
}


