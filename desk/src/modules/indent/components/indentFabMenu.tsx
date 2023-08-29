import React, { useEffect } from 'react'
import { red, blue, green } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import util from '../../../lib/utils';
import { useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import FabMenu from '../../../common/fabMenu';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
    tabKey:string
    selected: any,
    reset: Function,
    mutate: Function
    onShow?: Function
}

const IndentFabMenu = (props: Props) => {
    const { selected, reset, mutate, tabKey, onShow } = props;
    const { updateDoc } = useFrappeUpdateDoc()
    const navigate = useNavigate()


    const [open, setOpen] = React.useState(false);

    const selected_length = selected.indent_names.length
    const indentName = selected.indent_names[0]
    useEffect(() => {
        setOpen(!!selected_length);
    }, [selected_length]);

    const handleReset = () => {
        reset();
        setOpen(prev => !prev);
    };

    const handleDelete = () => {
        selected.indent_names.map(async (name: string) => {
            try {
                await updateDoc('Indent', name, { deleted_at: util.now })
                handleReset()
                mutate()
            } catch (error) {
                console.log('error', error);
            }
        })
    }

    const handleConfirm = () => {
        const indentsEncrypted = util.encryptAndDecrypt(selected?.indent_names, 'ENCRYPT')
        navigate(`/trip/confirm/${indentsEncrypted}?assignTrip=true`)
    }

    const handleEditIndent = () =>{
        navigate(`/indent/edit/${indentName}`)
    }

    const actions = [
        ...(tabKey === "Open" ? [
        {
            icon: <CheckCircleOutlineIcon />,
            name: "Confirm",
            f_props: {
                color: "white",
                bgcolor: blue[600],
                "&:hover": {
                    bgcolor: blue[400],
                },
            },
            handleClick: handleConfirm,
        },
    ...(selected_length === 1
          ? [
              {
                icon: <EditIcon />,
                name: "Edit Indent",
                f_props: {
                  color: "white",
                  bgcolor: blue[600],
                  "&:hover": {
                    bgcolor: red[700],
                  },
                },
                handleClick: handleEditIndent,
              },
            ]
          : []),
        {
            icon: <DeleteIcon />,
            name: "Delete",
            f_props: {
                color: "white",
                bgcolor: red[600],
                "&:hover": {
                    bgcolor: red[700],
                },
            },
            handleClick: handleDelete,
        }] : [
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
                handleClick: () => onShow ? onShow('showInvoice') : {},
                }
        ])
    ];

    return (
        <FabMenu open={open} handleReset={handleReset} actions={actions} />
    );
};

export default IndentFabMenu;
