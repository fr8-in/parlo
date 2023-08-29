import { colors, Paper, Stack } from '@mui/material';
import get from 'lodash/get';
import React, { useState } from 'react'
import { StyledTab, StyledTabs } from '../../../common/styledTabs';
import TabPanel from '../../../common/tabPanel';
import { Indent } from '../../../lib/types/indent';
import TripPayment from '../../trip/components/tripPayment';
import IndentDetailEwayContainer from './indentDetailEwayContainer';
import IndentDetailLrConatiner from './indentDetailLrConatiner';
import IndentItemContainer from './indentItemContainer';

interface IndentDetailStyledTabProps{
indentData:Indent;
indentName:any;
mutate?:Function
}

/**
 * @author Prasanth.M
 * @props refer interface IndentDetailStyledTabProps 
 * @returns Jsx.Element IndentDetailStyledTab
 */
const IndentDetailStyledTab = (props:IndentDetailStyledTabProps) => {

    const { indentData , indentName  , mutate } = props

    const workflowStatus = get(indentData,'workflow_state', null)
    const isStatusCreated = workflowStatus == "Created"

    const [value, setValue] = useState(()=>{
        if(isStatusCreated){
            return 2
        }else{
            return 0
        }
    })
    
    const handleStyleTag = (event: React.SyntheticEvent, newValue: any) => {
        setValue(newValue);
    }


    const indent_detail_tabs = [{
        key: 0,
        label: "LR",
        component:
        <Stack flexDirection={"column"} gap={2}>
        <IndentDetailLrConatiner mutate={mutate} lrNo={indentData?.lr_no} eWay={indentData?.way_bill_no} indentId={indentName}/>
        <IndentDetailEwayContainer mutate={mutate} lrNo={indentData?.lr_no} eWay={indentData?.way_bill_no} indentId={indentName}/>
        </Stack>
    },
    {
        key: 1,
        label: "Payment",
        component: <TripPayment fromIndent indentData={indentData} indentName={indentName}/>
    },
    {
        key: 2,
        label: "Items",
        component:<IndentItemContainer name={indentName} />
    },
]

    let filteredTabs = indent_detail_tabs.filter(tab => {
    if (isStatusCreated) {
      return tab.label === "Items";
    }
    return true
  });
  

  return (
    <Paper sx={{p:1}}>
            <StyledTabs value={value} onChange={handleStyleTag} scrollButtons={false} variant="scrollable" darkindicator="indicator-color">
                    {
                        filteredTabs.map((data, i) => {
                            return (
                                <StyledTab key={i} sx={{fontSize:14 , fontWeight:600 , color:colors.blue[400]}}
                                    label={data.label}

                                />
                            )
                        })
                    }

                </StyledTabs>
                {
                filteredTabs.map((data: any) => {
                    return (
                        <TabPanel className='overflow-auto' index={data.key} value={value} >
                            {data.component}
                        </TabPanel>
                    )
                })
            }
    </Paper>
  )
}

export default IndentDetailStyledTab