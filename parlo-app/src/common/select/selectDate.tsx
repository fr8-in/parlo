import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Calendar } from "antd";
import CustomDrawer from "../customDrawer";
import constants from "../../lib/constants";
import { Button, Grid, IconButton } from '@mui/material';
import moment from "moment";
import { useKeyPress } from "../../lib/hooks/useKeyPress";


interface Props {
    callBack: Function | any;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;
    dateTime: any

}
const SelectDate = (props: Props) => {
    const { open, onClose, onOpen, callBack, dateTime } = props;

    const [selectDate, setSelectDate] = useState({ date: "", time: "" });
    const onTimeChange = (value: string) => {
        setSelectDate({ ...selectDate, time: (value.length === 1 ? "0" + value : value) + ":00" });
    };

    const new_date = `${selectDate.date} ${selectDate.time}`;

    const onSelectDate = () => {
        callBack(new_date);
        onClose();
    }

    const onDateChange = (value: any) => {
        setSelectDate({ ...selectDate, date: value.format(constants.YYYYMMDD) });
    };

    useEffect(() => {
        setSelectDate({ ...selectDate, date: moment(dateTime).format(constants.YYYYMMDD),time:moment(dateTime).format('hh:mm') });
    }, [])
        
    //When escape key is pressed , onClose function is triggered.
    useKeyPress('Escape',onClose);

    return (
        <CustomDrawer
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            type="full"
            backdropClose={false} >
            <div className="">
                <div className="flex-1">
                    <div className="flex justify-between items-center p-3 h-16 gap-3 bg-slate-50 shadow-sm">

                        <h5>{moment(new_date).format(constants.DDMMMYYHHmm)}</h5>

                        <IconButton aria-label="close" onClick={onClose} type="button">
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <div className="p-2  custom-calendar relative">
                        <Calendar
                            fullscreen={false}
                            onChange={onDateChange} />
                    </div>
                    <div className="ml-3">
                        <Grid item xs={12} md={6}>
                            {constants.hours.map((hour) => (
                                <Button
                                    color="secondary"
                                    key={hour}
                                    size="small"
                                    onClick={() => onTimeChange(hour)}
                                    type="button"
                                    variant={
                                        selectDate.time.slice(0, 2) === hour ? "contained" : "outlined"
                                    }
                                    sx={{ m: 1, borderRadius: 20, px: 0 }}
                                >
                                    {hour}
                                </Button>
                            ))}
                        </Grid>
                    </div>
                </div>
            </div>
            <Button
                variant="contained"
                sx={{ m: 3,mb:0 }}
                color="secondary"
                type="button"
                onClick={onSelectDate}
            >
                Select Date
            </Button>

        </CustomDrawer>
    );
};

export default SelectDate;

