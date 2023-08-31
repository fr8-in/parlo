import React from 'react'
import { MetaObject } from '../types/util_types'

/**
 * To show,hide, toggle or custome change by given and object as initila
 * @param initial initial object
 * @returns value and funtions as object
 */
export const useShowHide = (initial: MetaObject) => {
  const [visible, setVisible] = React.useState<MetaObject>(initial)
  /**
   * Change value true to given key
   * @param value initial object member key name
   */
  const onShow = (key: string) => {
    setVisible({ ...visible, [key]: true })
  }
  /**
   * Change every thing to initial object
   */
  const onHide = () => {
    setVisible(initial)
  }
  /**
   * to toggle true/false to giveny key
   * @param key initial object member key name
   */
  const onToggle = (key: string) => {
    setVisible((prev: MetaObject) => ({ ...prev, [key]: !prev[key] }))
  }
  /**
   * send any desired value to the set of keys
   * @param object from initial object send any key value pair
   */
  const onCustomChange = (object: MetaObject) => {
    setVisible({ ...visible, ...object })
  }

  return { visible, onShow, onHide, onToggle, onCustomChange }
}
