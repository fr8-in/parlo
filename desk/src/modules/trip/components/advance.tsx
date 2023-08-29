import React from 'react'
import { InputController } from '../../../common/form/InputController'
import SelectController from '../../../common/form/selectController'
import { IconButton } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import SelectSupplierBank from '../../../common/select/selectSupplierBank';
import { useShowHideWithRecord } from '../../../lib/hooks';

interface Props {
    control: any
    fields: Array<any>
    watch: any
    remove: any
    supplier: string
    setValue: any
}
const Advance = (props: Props) => {
    const { control, fields, watch, remove, supplier, setValue } = props

    const initial = {showSupplierBank: false, keyName: ''}
    const { handleHide, handleShow, object } = useShowHideWithRecord(initial)
    
    const { data } = useFrappeGetDocList('Payment Mode', { fields: ["*"], caches:true })
    const options = data?.map((fs: any) => ({ value: fs.name, label: fs.name }))

    const { data: bank } = useFrappeGetDocList('Supplier Bank', { 
        fields: ["*"], 
        filters: [["supplier", '=', supplier]], 
        caches: true 
    })

    const primary = bank?.find((s_bank: any) => s_bank.is_primary)?.name

    return (
        <>
        {fields.map((item: any, index: number) => {
            const amountChange = (onchange: Function, value: any) => {
                onchange(+value)
                watch(`advance[${index}].amount`)
            }
            const modeChange = (onchange: Function, value: any) => {
                onchange(value)
                if (value === 'Bank') {
                    setValue(`advance[${index}].supplier_bank`, primary)
                }
            }
            return (
                <div className='flex justify-between items-start gap-x-2' key={index}>
                    <div className="grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 gap-x-2" key={item.mode + index}>
                        <SelectController
                            control={control}
                            name={`advance[${index}].mode`}
                            select_option={options}
                            placeholder="Select Mode"
                            label="Mode"
                            required={!!watch(`advance[${index}].amount`)}
                            handleOnChange={modeChange}
                        />
                        <InputController
                            name={`advance[${index}].amount`}
                            label='Amount'
                            placeholder="Enter amount"
                            control={control}
                            fieldType={'number'}
                            handleOnChange={amountChange}
                        />
                        <InputController
                            name={`advance[${index}].remarks`}
                            label='Remarks'
                            placeholder="Enter remarks"
                            multiline
                            control={control}
                        />
                        {watch(`advance[${index}].mode`) === 'Bank' ?
                         <div className='mb-3'>  
                                <InputController
                                control={control}
                                name={`advance[${index}].supplier_bank`}
                                    handleClick={() => handleShow('showSupplierBank', '', 'keyName', `advance[${index}].supplier_bank`)}
                                placeholder="Select account no"
                                label="Account No"
                                required={!!watch(`advance[${index}].amount`)}
                            /></div> 
                         : null}
                    </div>
                    <IconButton color='error' size='small' onClick={() => remove(index)} className={index === 0 ? 'invisible' : ''}>
                        <HighlightOffIcon />
                    </IconButton>
                </div>
            )
        })}
            {object.showSupplierBank ?
                <SelectSupplierBank 
                    callBack={setValue} 
                    open={object.showSupplierBank}
                    keyName={object.keyName} 
                    supplierBank={bank} 
                    supplier_name={supplier}
                    onOpen={() => handleShow('showSupplierBank', '', 'keyName', '')} 
                    onClose={handleHide}
                /> : null
        }
        </>
    )
}

export default Advance
