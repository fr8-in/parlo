import DeleteIcon from "@mui/icons-material/Delete";
import { green, red } from '@mui/material/colors'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FabMenu from '../../../common/fabMenu'
import util from "../../../lib/utils";
import ReceiptIcon from '@mui/icons-material/Receipt';


interface Props {
    selected: any
    reset: Function
    mutate: Function
    showInvoice: Function
}
const TripFabMenu = (props: Props) => {
    const { selected, reset, mutate, showInvoice } = props;

    const { updateDoc } = useFrappeUpdateDoc()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);


    const selected_length = selected.trip_names.length
    useEffect(() => {
        setOpen(!!selected_length);
    }, [selected_length]);

    const handleReset = () => {
        reset();
        setOpen(prev => !prev);
    };

    // const handleDelete = () => {
    //     selected.trip_names.map(async (name: string) => {
    //         try {
    //             const res = await updateDoc('Trip', name, { deleted_at: util.now })
    //             handleReset()
    //             mutate()
    //         }
    //         catch (error) {
    //             console.log("error", error)
    //         }
    //     })
    // }

    const actions = [
        // {
        //     icon: <DeleteIcon />,
        //     name: "Delete",
        //     f_props: {
        //         color: "white",
        //         bgcolor: red[600],
        //         "&:hover": {
        //             bgcolor: red[700]
        //         },
        //     },
        //     handleClick: handleDelete,
        // },
        {
            icon: <ReceiptIcon />,
            name: "Invoice",
            f_props: {
                color: "white",
                bgcolor: green[600],
                "&:hover": {
                    bgcolor: green[700]
                },
            },
            handleClick: () => { showInvoice('showInvoice') },
        }
    ];


    return (
        <div>
            <FabMenu open={open} handleReset={handleReset} actions={actions} />
        </div>
    )
}
export default TripFabMenu