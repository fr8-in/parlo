import { IconButton } from '@mui/material'
import { useState } from 'react'
import { useShowHide } from '../../../lib/hooks'
import AddChargesSvg from '../../../lib/icons/addChargesSvg'
import ReduceChargesSvg from '../../../lib/icons/reduceChargesSvg'
import IndentAddChargesTableContainer from '../../indent/components/indentAddChargesTableContainer'
import IndentCustomerPaymentDetails from '../../indent/components/indentCustomerPaymentDetails'
import AddCharges from '../components/addCharges'
import TripAddChargesTableContainer from './tripAddChargesTableContainer'
import TripSupplierPaymentDetails from './tripSupplierPayment'

interface Props {
    tripName?: any
    tripData?:any
    fromIndent?:boolean
    indentName?:string
    indentData?:any
}

const TripPayment = (props: Props) => {
    const { tripName , tripData , fromIndent , indentData , indentName} = props

    const initial_show_hide = {
        showAddCharge: false,
        showReduceCharge: false
    }

    const [refetch, setRefetch] = useState(0)
    const handleChargeType = (type: any) => {
        setRefetch((prev:number)=>prev+1)
    };

    const { visible, onShow, onHide } = useShowHide(initial_show_hide)


    return (
        <div>
            <div className='flex gap-3'>
                <div className=" w-16 h-14   p-4  flex flex-col bg-blue-100 justify-center items-center cursor-pointer rounded-md   margin-2  ">
                    <div className="m-auto  mb-4 flex flex-col items-center" onClick={() => onShow("showAddCharge")}>
                        <IconButton
                            sx={{ paddingBottom: 0, marginTop: 3 }}
                            size="small"
                            className='p-2'
                            onClick={() => onShow("showAddCharge")}
                        >
                            <AddChargesSvg />
                        </IconButton>
                        <p className="text-xs">Add</p>
                        <p className="text-[7px] -mt-2">Charge</p>
                    </div>
                </div>
                <div className=" w-16 h-14  flex flex-col bg-red-100 justify-center items-center cursor-pointer rounded-md   margin-2  ">
                    <div className="m-auto  mb-4 flex flex-col items-center" onClick={() => onShow("showReduceCharge")}>

                        <IconButton
                            sx={{ paddingBottom: 0, marginTop: 3 }}
                            size="small"
                            className='text-center p-3'
                            onClick={() => onShow("showReduceCharge")}
                        >
                            <ReduceChargesSvg />
                        </IconButton>
                        <p className="text-xs text-center" >Reduce</p>
                        <p className="text-[7px] text-center -mt-2">Charge</p>
                    </div>
                </div>
            </div>
            {fromIndent ? (
            <>
              <IndentAddChargesTableContainer
                refetch={refetch}
                indentName={indentName}
              />
              <IndentCustomerPaymentDetails
                indentName={indentName}
                indentData={indentData}
              />
            </>
          ) : (
            <>
              <TripAddChargesTableContainer
                tripName={tripName}
                refetch={refetch}
              />
              <TripSupplierPaymentDetails
                tripData={tripData}
                tripName={tripName}
              />
            </>
          )}
            {visible.showAddCharge ?
                <AddCharges
                    callBack={handleChargeType}
                    open={visible.showAddCharge}
                    onClose={onHide}
                    tripName={tripName}
                    fromIndent={fromIndent}
                    indentName={indentName}
                />
                : null}
            {visible.showReduceCharge ?
                <AddCharges
                    callBack={handleChargeType}
                    tripName={tripName}
                    onClose={onHide}
                    is_reduce
                    open={visible.showReduceCharge}
                    fromIndent={fromIndent}
                    indentName={indentName}
                />
                : null}
        </div>
    )
}

export default TripPayment
