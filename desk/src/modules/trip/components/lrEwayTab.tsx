
import React, { useState } from 'react'
import { StyledTab, StyledTabs } from '../../../common/styledTabs';
import TabPanel from '../../../common/tabPanel';
import EditEwayBill from './editEwayBill';
import EditLr from './editLR';
import { Modal } from "antd";
import { useMediaQuery, useTheme } from '@mui/material';

interface Props {
  open: boolean
  handleCancel: any
  indentId: string
  lrNo:string
  eWay:string
  mutate?:any
  openEway?:boolean
}

const LrEwayTab = (props: Props) => {
    const { open, handleCancel, indentId, lrNo, eWay, mutate , openEway } = props
  const [value, setValue] = useState(()=>{
    if(openEway){
      return 1
    }else{
      return 0
    }
  })

  const handleStyleTag = (event: React.SyntheticEvent, newValue: any) => {
    setValue(newValue);
  } 

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const common = { maxWidth: 800, margin: '0 auto' }
  const desktop = { ...common, top: 20 }
  const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }

  const trip_tabs = [{
    key: 0,
    label: "LR",
      component: <EditLr indentId={indentId} mutate={mutate} lrNo={lrNo} onClose={handleCancel} />

  },
  {
    key: 1,
    label: "Eway",
      component: <EditEwayBill indentId={indentId} mutate={mutate} eWay={eWay} onClose={handleCancel}  />
  },

  ]


  return (
    <div>
      <Modal
        open={open}
        footer={null}
        onCancel={handleCancel}
        style={isMobile ? mobile : desktop}
        width={isMobile ? '100%' : '50%'}
        className="mobile_overlay"
      >
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
        {
          trip_tabs.map((data: any) => {
            return (
              <TabPanel index={data.key} value={value} >
                {data.component}
              </TabPanel>
            )
          })
        }
      </Modal>
    </div>
  )
}

export default LrEwayTab 
