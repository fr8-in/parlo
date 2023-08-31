import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Table } from 'antd'
import moment from 'moment'
import Stack from '@mui/material/Stack'
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useShowHideWithRecord } from '../lib/hooks/useShowHideWithRecord'
import PaymentDetailModal from './paymentDetailsModal';

interface PaymentAccordianProps {
  data:any;
  payable:number;
  payment:number;
  balance:number;
  title:string;
}
/**
 * @author Prasanth.M
 * @description This  a commom component shared by Trip Charges and Indent Charges.
 * @props refer interface PaymentAccordianProps
 * @returns Jsx.Element PaymentAccordian
 */
const PaymentAccordian = (props: PaymentAccordianProps) => {
  const {  data , balance ,payable ,payment , title } = props

  const showHideInitial = {
    showDetailModal: false,
    detailModalData: {}
  }
  const { handleHide, handleShow, object } = useShowHideWithRecord(showHideInitial)

  const columns: any = [
    {
      title: 'Type',
      dataIndex: 'payment_type',
      key: 'payment_type',
      width: "20%"
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: "20%"
    },
    {
      title: 'Date',
      dataIndex: 'creation',
      key: 'cration',
      width: "20%",
      render: (creation: string) => (creation ? moment(creation).format('DD-MMM-YY') : null)
    },
    {
      title: 'Mode',
      dataIndex: 'payment_mode',
      key: 'payment_mode',
      width: "20%"
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      fixed: 'right',
      width: "20%",
      render: (amount: any, record: any) => (
        <Stack flexDirection={"row"} justifyContent="space-between">
          <p className='text-sm'>{amount ? amount : '-'}</p>
          <ChevronRightIcon onClick={() => handleShow('showDetailModal', '', 'detailModalData', record)} color='disabled' />
        </Stack>)
    },
  ];

  return (
    <div>
      <Accordion elevation={0}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography fontSize={16} fontWeight={600} variant='h6'>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{ w: '100%' }}
        >
          <Table
            className="no-separator-antd"
            scroll={{ x: 550 }}
            columns={columns}
            dataSource={data}
            rowKey={(record:any)=>record.name}
            pagination={false}
          />
          <Stack flexDirection={"row"} width={'100%'} maxHeight={80} minHeight={80}>
            <TotalAmountDiv header={'Payable'} value={payable} />
            <TotalAmountDiv header={'Payment'} value={payment} />
            <TotalAmountDiv header={'Balance'} value={balance} />
          </Stack>
        </AccordionDetails>
      </Accordion>
      {
        object.showDetailModal ?
          <PaymentDetailModal
            open={object.showDetailModal}
            onClose={handleHide}
            paymentData={object.detailModalData}
          /> : null
      }
    </div>
  )
}

const TotalAmountDiv = (props: { header: string; value: number }) => {
  return (
    <div className='border flex w-full flex-col items-center justify-center'>
      <Typography variant='body2' color="GrayText">
        {props.header}
      </Typography>
      <Typography>
      ₹{props.value}
      </Typography>
    </div>
  )
}

export default PaymentAccordian