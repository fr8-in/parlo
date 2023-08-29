import * as React from 'react';
import { IconButton, Button, Card, Modal, TextField, Typography } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useFrappeGetDocList, useFrappePutCall, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { message } from 'antd';

export const AddCharge = (props: any) => {
    const { visible, onHide } = props
    const [age, setAge] = React.useState('');

    const { data, error, isValidating, mutate }: any = useFrappeGetDocList('Charge type',
        {
            /** Fields to be fetched - Optional */
            fields: ['*'],
            /** Filters to be applied - SQL OR operation */
            orFilters: [],
        },);

    const { updateDoc } = useFrappeUpdateDoc()

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value as string);
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            const response = await updateDoc('Indent charge', "49a753b071", { amount: 10000 })
            console.log({ response });
        } catch (e:any) {
            message.error(`${e?.exception}`)
        }
    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 2,
    };

    return (
        <Modal
            open={visible}
            title='Add charges'
            onClose={onHide}
            keepMounted
        >

            <Card sx={style}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: 15 }}>
                        Add charge
                    </Typography>

                    <IconButton onClick={onHide}>
                        <CloseIcon sx={{ color: 'black' }} />
                    </IconButton>
                </div>


                <FormControl fullWidth >

                    <InputLabel id="demo-simple-select-label">Charge type</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={age}
                        label="Charge type"
                        onChange={handleChange}
                    >
                        {
                            data?.map((chargeType: any, index: number) => {
                                return (
                                    <MenuItem value={chargeType?.name}>{chargeType?.name}</MenuItem>
                                )

                            })
                        }
                    </Select>

                    <div style={{ marginBottom: 10 }} />

                    <TextField id="outlined-basic" label="Amount" variant="outlined" sx={{ backgroundColor: 'red' }} />
                    <div style={{ marginBottom: 10 }} />

                    <div style={{ display: 'flex' }}>
                        <Button variant='contained' sx={{ width: '40%', }} onClick={handleSubmit}>Submit</Button>
                    </div>

                </FormControl>

            </Card>
        </Modal>
    )
}

