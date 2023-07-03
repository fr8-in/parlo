import React from 'react'
import { MetaObject } from '../types/util_types'

/**
 * To show,hide with passed data by given and object as initial
 * @param initial initial object
 * @returns value and funtions as object
 */

export const useShowHideWithRecord = (initial:MetaObject) => {
  const [object, setObject] = React.useState<MetaObject>(initial)

  /**
   * Show any ReactNode by passing clicked item record
   * @param visibleKey key name want to change value to true
   * @param title title to show if model or drawer if not rewuired pass empty string
   * @param dataKey to store data in hook state pass key name
   * @param data send any kind of data to set hooks state
   */
  const handleShow = (visibleKey:string, title:string, dataKey:string, data:any) => {
    setObject({ ...object, [dataKey]: data, title: title, [visibleKey]: true })
  }
  /**
   * Change every thing to initial object
   */
  const handleHide = () => {
    setObject(initial)
  }

  return { object, handleShow, handleHide }
}
