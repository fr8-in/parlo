import { useFrappeGetDocList, useFrappePostCall } from "frappe-react-sdk";
import { Indent, SorterType } from "../../../lib/types/indent";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import util from "../../../lib/utils";
import ConfirmTripForm from "../components/confirmTripForm";

const ConfirmTrip = () => {
    
    let { indentIds } = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const assignTrip = searchParams.get('assignTrip') === "true" 

    const indentNames = util.encryptAndDecrypt(indentIds, 'DECRYPT')

    return (
        <ConfirmTripForm  
         indentNames={indentNames}  
         assignTrip={assignTrip}
        />
        )
    
}

export default ConfirmTrip
