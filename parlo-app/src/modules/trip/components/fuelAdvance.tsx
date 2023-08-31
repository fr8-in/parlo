import React, { useState } from 'react'
import { InputController } from '../../../common/form/InputController'
import { useShowHide } from '../../../lib/hooks'
import SelectFuelStation from '../../../common/select/selectFuelStation'

interface Props {
    control: any
    fields: Array<any>
    setValue:any
    watch:any
}
const FuelAdvance = (props: Props) => {
    const [stationKey, setStationKey] = useState('')
    const initial = { showStation: false}
    const {visible, onHide, onShow}= useShowHide(initial)
    const { control, fields, setValue, watch } = props
    const handleStaionName = (value:string) =>{
        setValue(stationKey, value)
        onHide()
    }
    return (
        fields.map((item: any, index: number) => {
            const driver_cash = (watch(`fuel_advance[${index}].driver_cash`) || 0) * 1
            const handleStationChange = () => {
                onShow("showStation")
                setStationKey(`fuel_advance[${index}].station_name`)
            }
            const literChange = (onchange:Function, value:any) => {
                onchange(+value)
                const f_total = (watch(`fuel_advance[${index}].fuel_rate`) || 1) * (value || 1)
                setValue(`fuel_advance[${index}].fuel_total`, f_total)
                setValue(`fuel_advance[${index}].total`, driver_cash  + f_total)
            }
            const rateChange = (onchange: Function, value: any) => {
                onchange(+value)
                setValue(`fuel_advance[${index}].fuel_total`, (watch(`fuel_advance[${index}].liters`) || 1) * (value || 1))
                setValue(`fuel_advance[${index}].total`, driver_cash + (watch(`fuel_advance[${index}].fuel_total`) * 1))
            }
            const fuelTotalChange = (onchange: Function, value: any) => {
                onchange(+value)
                setValue(`fuel_advance[${index}].fuel_rate`, (value || 1)  / watch(`fuel_advance[${index}].liters`))
                setValue(`fuel_advance[${index}].total`, driver_cash + (+value))
            }
            const drivereCashChange = (onchange: Function, value: any) => {
                onchange(+value)
                setValue(`fuel_advance[${index}].total`, ((value || 1) * 1) + (watch(`fuel_advance[${index}].fuel_total`) * 1))
            }
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2" key={item.station_name+index}>
                    <div className="col-span-1 md:col-span-2">
                        <InputController
                            name={`fuel_advance[${index}].station_name`}
                            label='Fuel Station'
                            control={control}
                            endIcon={"select"}
                            required={!!watch(`fuel_advance[${index}].total`)}
                            placeholder="Select Station"
                            handleClick={handleStationChange}
                        />
                    </div>
                    <InputController
                        name={`fuel_advance[${index}].liters`}
                        label='Ltr'
                        placeholder="Enter liters"
                        control={control}
                        fieldType={'number'}
                        handleOnChange={literChange}
                    />
                    <InputController
                        name={`fuel_advance[${index}].fuel_rate`}
                        label='Fuel Rate'
                        placeholder="Enter Rate"
                        control={control}
                        fieldType={'number'}
                        handleOnChange={rateChange}
                    />
                    <InputController
                        name={`fuel_advance[${index}].fuel_total`}
                        label='Fuel Total'
                        placeholder="Enter Amount"
                        control={control}
                        fieldType={'number'}
                        handleOnChange={fuelTotalChange}
                    />
                    <InputController
                        name={`fuel_advance[${index}].driver_cash`}
                        label='Cash'
                        placeholder="Enter Amount"
                        control={control}
                        fieldType={'number'}
                        handleOnChange={drivereCashChange}
                    />
                    <InputController
                        name={`fuel_advance[${index}].total`}
                        label='Total'
                        disable
                        control={control}
                        fieldType={'number'}
                    />
                    {visible.showStation ? (
                        <SelectFuelStation 
                            open={visible.showStation} 
                            onClose={onHide}
                            onOpen={() => onShow('showStation')}
                            callBack={handleStaionName}
                        />
                    ) : null}
                </div>
            )
        })
    )
}

export default FuelAdvance