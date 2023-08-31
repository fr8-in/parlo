import { Button } from '@mui/material'
import React, { useState } from 'react'
import { StyledTab, StyledTabs } from '../../../common/styledTabs'
import TabPanel from '../../../common/tabPanel'
import TripDetailIndent from './tripDetailindent'
import TripPayment from './tripPayment'
import { useShowHide } from '../../../lib/hooks'
import SelectIndent from './selectIndent'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useFrappePostCall } from 'frappe-react-sdk'
import { message } from 'antd'
import constants from '../../../lib/constants'
import util from '../../../lib/utils'

interface Props {
    tripName: any
    tripWorkflow: string,
    mutate: any
    tripData:any
}

const StyledTabIndentPayment = (props: Props) => {

    const { tripName, tripWorkflow,mutate , tripData} = props

    const [value, setValue] = useState(0)
    const [indentUpdate,setIndentUpdate] = useState<any>(null)
    const {TRIP_STATUS} = constants
    const isConfirmed = tripWorkflow == TRIP_STATUS.CONFIRMED
    const handleStyleTag = (event: React.SyntheticEvent, newValue: any) => {
        setValue(newValue);
    }

    const { call, error ,loading} = useFrappePostCall('parlo.trip.updateIndentInTrip.update_indent_in_trip')

    const trip_detail_tabs = [{
        key: 0,
        label: "Indent",
        component: <TripDetailIndent indentUpdate={indentUpdate} tripName={tripName} tripWorkflow={tripWorkflow} />
    },
    {
        key: 1,
        label: "Payment",
        component: <TripPayment tripData={tripData} tripName={tripName} />
    },
    ]

    const handleIndent = async (indents: Array<string>) => {
        const updateIndentInput = {
            indents,
            trip: tripName
        }

        await call({ updateIndentInput }).then(
            (result: any) => {
                console.log({ result: result?.message })
                setIndentUpdate(util.current)
                message.success('Indent added successfully')
                mutate()
            }
        ).catch(error => {
            const httpStatusText = error?.httpStatusText

            if (httpStatusText == 'CONFLICT') {
                message.error('Indent already exists')
            } else {
                message.error(error?.message)
            }
        });

    };

    const initial_show_hide = {
        showIndent: false
    }

    const { onHide, onShow, visible } = useShowHide(initial_show_hide)
    return (
        <div>
            <div className='bg-card mt-2 flex justify-between items-center'>
                <StyledTabs value={value} onChange={handleStyleTag} scrollButtons={false} variant="scrollable" darkindicator="indicator-color">
                    {
                        trip_detail_tabs.map((data, i) => {
                            return (
                                <StyledTab key={i}
                                    label={data.label}

                                />
                            )
                        })
                    }

                </StyledTabs>

                {isConfirmed ? <div className='mr-5'>
                    <Button
                        color='secondary'
                        size='small'
                        variant='outlined'
                        sx={{ borderRadius: 40, px: 1.5 }}
                        onClick={() => onShow('showIndent')}
                        startIcon={<AddOutlinedIcon />}
                     >
                        Add Indent
                    </Button>
                </div> : null}

            </div>
            {
                trip_detail_tabs.map((data: any) => {
                    return (
                        <TabPanel index={data.key} value={value} >
                            {data.component}
                        </TabPanel>
                    )
                })
            }

            {visible.showIndent ? (
                <SelectIndent
                    handleCancel={onHide}
                    open={visible.showIndent}
                    tripId={tripName}
                    selected={{ indent_names: [], indents: [] }}
                    onChange={handleIndent}
                />
            ) : null}

        </div>
    )
}

export default StyledTabIndentPayment 
