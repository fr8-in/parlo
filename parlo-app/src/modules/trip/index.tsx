
import { Button } from '@mui/material'
import React, { useState } from 'react'
import { StyledTab, StyledTabs } from '../../common/styledTabs'
import TabPanel from '../../common/tabPanel'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from 'react-router-dom';
import TripTableContainer from './components/tripTableContainer'
import { Empty } from 'antd';
import BankRequestContainer from './components/bankRequstTableContainer';
import InvoiceTableContainer from './components/invoiceTableContainer';
import FuelRequestContainer from './components/fuelRequestContainer';
import PaymentContainer from './components/paymentContainer';


const TripList = (props: any) => {

    const [value, setValue] = useState(1)
    const navigate = useNavigate()

    const handleStyleTag = (event: React.SyntheticEvent, newValue: any) => {
        setValue(newValue);
    }


    const handleConfirm = () => {
        navigate(`/trip/confirm/1`)
    }

    const trip_tabs = [{
        key: 0,
        label: "Assigned"
    },
    {

        key: 1,
        label: "Active"

    },
    {
        key: 2,
        label: "Delivered"

    },
    {
        key: 3,
        label: "Invoiced"
    },
    {
        key: 4,
        label: "All"
    },
    {
        key: 5,
        label: "Payments"
    },
    {
        key: 6,
        label: "Bank Request"
    },
    {
        key: 7,
        label: "Fuel Request"
    },
    ]

    const component:any = {
        0: <TripTableContainer tabKey={'Assigned'} />,
        1: <TripTableContainer tabKey={'Active'} />,
        2: <TripTableContainer tabKey={'Delivered'} />,
        3: <InvoiceTableContainer />,
        4: <TripTableContainer tabKey={'All'} />,
        5: <PaymentContainer type='trip' />,
        6: <BankRequestContainer/>,
        7: <FuelRequestContainer/>,
    }

    return (
        <div>
            <div className='bg-card flex p-0 justify-between items-center'>
                <StyledTabs value={value} onChange={handleStyleTag} scrollButtons={false} variant="scrollable" darkindicator="indicator-color">
                    {
                        trip_tabs.map((data, i) => {
                            return (
                                <StyledTab key={i}
                                    label={data.label}

                                />
                            )
                        })
                    }
                </StyledTabs>
                <div className='mr-5'>
                    <Button
                        color='secondary'
                        size='small'
                        variant='contained'
                        sx={{ borderRadius: 40, px: 1.5 }}
                        startIcon={<AddOutlinedIcon />}
                        onClick={handleConfirm}
                    >
                        Trip
                    </Button>
                </div>
            </div>
            {
                trip_tabs.map((data: any, index:number) => {
                    return (
                        <TabPanel index={data.key} value={value} key={data.key}  >
                            <div className='border-t-2 h-full border-blue-600 bg-white pb-2 rounded-b-lg shadow-sm'>
                                {component[index] || <Empty />}
                            </div>
                        </TabPanel>
                    )
                })
            }
        </div>
    )
}

export default TripList 
