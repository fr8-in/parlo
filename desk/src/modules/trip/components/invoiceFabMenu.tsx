import { blue } from '@mui/material/colors'
import React, { useEffect, useState } from 'react'
import FabMenu from '../../../common/fabMenu'
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';

interface Props {
    selected: any
    reset: Function
    mutate: Function
    onShow: Function
}

const InvoiceFabMenu = (props: Props) => {
    const { selected, reset, mutate, onShow } = props;

    const [open, setOpen] = useState(false);

    const selected_length = selected.names.length
    useEffect(() => {
        setOpen(!!selected_length);
    }, [selected_length]);

    const handleReset = () => {
        reset();
        setOpen(prev => !prev);
    };

    const actions = [
        {
            icon: <ImportContactsOutlinedIcon />,
            name: "Book Balance",
            f_props: {
                color: "white",
                bgcolor: blue[600],
                "&:hover": {
                    bgcolor: blue[700]
                },
            },
            handleClick: () => { onShow('showBalanceBooking') },
        }
    ];

    return (
        <div>
            <FabMenu open={open} handleReset={handleReset} actions={actions} />
        </div>
    )
}

export default InvoiceFabMenu
