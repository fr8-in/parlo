
import { blue } from '@mui/material/colors'
import { useFrappeUpdateDoc } from 'frappe-react-sdk'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FabMenu from '../../../common/fabMenu'
import { UploadOutlined } from "@ant-design/icons";
import { useShowHide } from '../../../lib/hooks'

interface Props {
    selected: any
    reset: Function
    mutate: Function
    indentId: any
}

const PodFabMenu = (props: Props) => {
    const { selected, reset, mutate, indentId } = props;

    const { updateDoc } = useFrappeUpdateDoc()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);

    const initialShow = {
        showPodPendingCourier: false
    }
    const { visible, onShow, onHide } = useShowHide(initialShow)
    const selected_length = selected.indent_names.length
    useEffect(() => {
        setOpen(!!selected_length);
    }, [selected_length]);

    const handleReset = () => {
        reset();
        setOpen(prev => !prev);
    };

    const handleUpload = () => {
        navigate(`/trip/podpending/courier/${indentId}`)
        // onShow("showPodPendingCourier")
    }

    const actions = [{
        icon: <UploadOutlined />,
        name: "Upload",
        f_props: {
            color: "white",
            bgcolor: blue[600],
            "&:hover": {
                bgcolor: blue[700]
            },
        },
        handleClick: handleUpload
    }];

    return (
        <div>
            <FabMenu open={open} handleReset={handleReset} actions={actions} />
        </div>
    )
}

export default PodFabMenu
