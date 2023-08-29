import { useFrappeGetDocList } from 'frappe-react-sdk';
import { useEffect } from 'react';
import { TripChargeType } from '../../../lib/types/trip';
import AddChargesWebTable from '../../trip/components/addChargesWebTable';

interface IndentAddChargesTableContainerProps {
    refetch: number
    indentName:any
}

/**
 * @author Prasanth.M
 * @param props refer IndentAddChargesTableContainerProps
 * @returns JSX.Element IndentAddChargesTableContainer
 */
const IndentAddChargesTableContainer = (props: IndentAddChargesTableContainerProps) => {
    const { refetch , indentName } = props;

    const { data, error, isValidating, mutate } = useFrappeGetDocList<TripChargeType>(
        'Indent Charge List',
        {
            fields: ["charge_type",
                "indent",
                "name",
                "amount",
                "remarks"],
            filters: [["indent", "=", `${indentName}`]]
        }
    );

    useEffect(()=>{
        mutate()
    }, [refetch])

    return (
        <AddChargesWebTable refetch={refetch} mutate={mutate} fromIndent data={data}/>
    )
}

export default IndentAddChargesTableContainer