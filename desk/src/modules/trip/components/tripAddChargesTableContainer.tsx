import { useFrappeGetDocList } from 'frappe-react-sdk';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { TripChargeType } from '../../../lib/types/trip';
import AddChargesWebTable from './addChargesWebTable'

interface TripAddChargesTableContainerProps {
    refetch: number
    tripName:String
}

/**
 * @author Prasanth.M
 * @param props refer interface TripAddChargesTableContainerProps
 * @returns JSX.Element TripAddChargesTableContainer
 */
const TripAddChargesTableContainer = (props: TripAddChargesTableContainerProps) => {
    const { refetch , tripName } = props;

    const { data, error, isValidating, mutate } = useFrappeGetDocList<TripChargeType>(
        'Trip Charge',
        {
            fields: ["charge_type",
                "trip",
                "name",
                "customer_amount",
                "supplier_amount",
                "driver_amount",
                "remarks"],
            filters: [["trip", "=", `${tripName}`]]
        }
    );

    useEffect(()=>{
        mutate()
    }, [refetch])

    const modifiedArray = !isEmpty(data) ? data.map((obj:TripChargeType) => {
        const { supplier_amount  , ...rest } = obj;
        return { ...rest, amount: supplier_amount };
      }) : []

    return (
        <AddChargesWebTable refetch={refetch} mutate={mutate} data={modifiedArray}/>
    )
}

export default TripAddChargesTableContainer