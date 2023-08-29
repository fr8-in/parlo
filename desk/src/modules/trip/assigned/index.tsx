import { useFrappeGetDoc, useFrappeGetDocList } from "frappe-react-sdk";
import { Indent } from "../../../lib/types/indent";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ConfirmTripForm from "../components/confirmTripForm";
import { Trip } from "../../../lib/types/trip";
import isEmpty from "lodash/isEmpty";
import { Loading } from "../../../common/loading";

const ConfirmAssignedTrip = () => {

    let { tripName } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const assignTrip = searchParams.get('assignTrip') === "true" 

    const [indentName, setIndentName] = useState<Array<string>>([])
    const { data, isValidating, isLoading } = useFrappeGetDoc<Trip>(
        'Trip',
        tripName
    );

    const { data: indent_data, mutate, isLoading: isIndentLoading, isValidating: indentvalidation } = useFrappeGetDocList<Indent>(
        'Indent',
        {
            fields: ["*"],
            filters: [['trip', '=', `${tripName}`]],
        }
    );

    useEffect(() => {
        if (!isEmpty(indent_data)) {
            const names: Array<string> = indent_data ? indent_data.map((data: any) => data.name) : []
            setIndentName(names)
        }
    }, [indent_data])

    return (
        <div>
            {
                isLoading || isIndentLoading ? <Loading /> :
                    <ConfirmTripForm
                        tripData={data}
                        indentNames={indentName}
                        tripName={tripName}
                        fromAssignedTrip={true}
                        assignTrip={assignTrip}
                    />
            }
        </div>

    )

}

export default ConfirmAssignedTrip
