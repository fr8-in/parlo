import { Paper, Button } from "@mui/material";
import { Empty , Table } from "antd";
import { useFrappeGetDoc } from "frappe-react-sdk";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { useShowHide } from "../../../lib/hooks/useShowHide";
import LrEwayTab from "../../trip/components/lrEwayTab";

interface IndentDetailLrContainerProps {
  eWay: string;
  indentId : string;
  lrNo:string;
  mutate?:Function;
}

/**
 * @author Prasanth.M
 * @param props refer interface IndentDetailLrContainerProps
 * @returns JSX.Element IndentDetailLrContainer
 */
const IndentDetailLrContainer = (props: IndentDetailLrContainerProps) => {
  const { eWay , indentId , lrNo  , mutate } = props;


  const showHideInitial = {
    showLrTab : false
  }
  const { onHide , onShow , visible } = useShowHide(showHideInitial)
  
  const { data , isLoading } = useFrappeGetDoc("Lr", lrNo);
  
  const dataSource = [
    {
      lrNo: get(data, "lr_no", null),
      date: get(data, "date", null),
      remarks: get(data, "remarks", null),
      weight: get(data, "weight", null),
    }
  ]

  const columns = [{
    title : "LR NO",
    dataIndex : "lrNo",
    key:"eway_bill"
  },
  {
    title : "Expiry At",
    dataIndex : "date",
    key:"date",
    render:(date:any)=> date ? moment(date).format("DD-MMM-YY") : null
  },
  {
    title : "Remarks",
    dataIndex : "remarks",
    key:"remarks",
    render:(remarks:any)=> remarks ? remarks : '-'
  },
  {
    title : "Weight",
    dataIndex : "weight",
    key:"remarks",
    render:(remarks:any)=> remarks ? remarks : '-'
  }
]

  return (
    <Paper elevation={1} sx={{ minWidth: 500 }}>
      <Table columns={columns} dataSource={ isEmpty(data) ? [] : dataSource } size="small" pagination={false} locale={{
        emptyText:
        <div style={{ height: '100px' }}> {/* Set the desired height */}
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <div style={{ textAlign: 'right'}}>
            <Button size="small" disableElevation variant="contained" sx={{bottom:40}} onClick={()=>onShow('showLrTab')}>UPLOAD LR</Button>
          </div>
        </Empty>
      </div>
      }} />
        {
        visible.showLrTab ?
        <LrEwayTab 
        open={visible.showLrTab} 
        handleCancel={onHide} 
        indentId={indentId} 
        lrNo={lrNo} 
        eWay={eWay} 
        mutate={mutate}
        /> : null
      }
    </Paper>
  );
};

export default IndentDetailLrContainer;
