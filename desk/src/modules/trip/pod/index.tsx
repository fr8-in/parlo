import { Button, Card, Divider, useMediaQuery, useTheme } from '@mui/material'
import { Box } from '@mui/system';
import { Space, Table } from 'antd';
import { InputController } from '../../../common/form/InputController';
import { useForm } from 'react-hook-form';
import { RadioButtonController } from '../../../common/form/radioButtonController';
import { useShowHide } from '../../../lib/hooks';
import { useFrappeGetDoc } from 'frappe-react-sdk';
import constants from '../../../lib/constants';
import { SourceDestination } from '../../../common/sourceDestination';
import { EyeOutlined } from '@ant-design/icons';
import { Loading } from '../../../common/loading';
import { UploadOutlined } from '@mui/icons-material';
import SelectDate from '../../../common/select/selectDate';
import moment from 'moment';
import BackButton from '../../../common/backButton';

interface FormProps {
  courier_name: string
  recieved_by: string
  date_time: string
  remarks: string
  courier: any
  podcourierlist: any
}
const initialForm = {
  courier_name: "",
  recieved_by: "",
  date_time: "",
  remarks: "",
  courier: null,
  podcourierlist: 1


}
interface Props {

  open?: boolean
  handleCancel?: any
  indentId?:any

}


const PodPendingCourier =(props:Props) => {

const {open, handleCancel, indentId}= props

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    getValues
  } = useForm<FormProps>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialForm
  })


  const selected = watch("podcourierlist")


    const { data, error, isValidating, mutate } = useFrappeGetDoc(
      'Indent',
     indentId

  );
  const indentData:any= data


  
  const columns = [
    {
      title: "POD",
      dataIndex: "pod",
      render: (record: any) => {
        return (
          <Button><UploadOutlined /></Button>
        )
      }
    },
    {
      title: "Truck no",
      dataIndex: "truck_no",
    },
    {
      title: "LR No",
      dataIndex: "lr_no",
    },
    {
      title: "S.no",
      dataIndex: "series",
    },
    {
      title: "Source",
      dataIndex: "source",
    },
    {
      title: "Destination",
      dataIndex: "destination",
    },
    {
      title: "Employee",
      dataIndex: "employee",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
  ]

  const initiashow = {
    showDate: false
  }

  const { onShow, onHide, visible } = useShowHide(initiashow)

  const handleDate = (date: any) => {

    setValue("date_time", moment(date).format(constants.DDMMMYYHHmm))
  }
  return (

    <div>
     

            <Card sx={{ mt: 2, m: 2 }}>
              <div className='flex p-2 gap-3'>
                <BackButton />
                <h6>POD Verification</h6>
              </div>

            </Card>

            <Box
              component="form"
              autoComplete='="off'

            >

              <Card sx={{ mt: 2, p: 2, m: 2 }}>

                <RadioButtonController

                  control={control}
                  name={'podcourierlist'}
                  items={[
                    { value: 1, label: "courier" },
                    { value: 2, label: "by_hand" },
                    { value: 3, label: "missing" }
                  ]}
                  row />



                <div className='mt-4'>

                  {selected == 1 ?
                    <InputController
                      control={control}
                      name='courier_name'
                      label="Courier Name" />
                    : null}


                  {selected != 3 ?
                    <InputController
                      control={control}
                      name='recieved_by'
                      label="Recieved By" />
                    : null}

                  <InputController
                    control={control}
                    name='date_time'
                    label="Date & time"
                    handleClick={() => onShow("showDate")}
                    endIcon='calendar' />

                  <InputController
                    control={control}
                    name='remarks'
                    label="Remarks" />
                </div>

              </Card>

            </Box>

            {isMobile ? isValidating ? <Loading /> :

              (selected == 1 ?
                <Card sx={{ mt: 2, m: 2, p: 2 }}>

                  <div className='flex justify-between '>
                    <p className='text-xs'>{indentData?.id} | {indentData?.owner}</p>
                    <p></p>
                  </div>
                  <Divider sx={{ mb: 1 }} />
                  <Space>
                    <SourceDestination source_name={indentData?.source} destination_name={indentData?.destination} />
                  </Space>
                  <Divider sx={{ mb: 1 }} />
                  <div className='flex justify-between'>
                    <p className='text-m'>LR NO :{indentData?.lr}</p>
                    <div className="pt-4">
           
          </div>
                    <Button variant="outlined" className='bottom-0 fixed' fullWidth color="secondary" sx={{ width: 120, gap: 3 }} size='small' >POD <EyeOutlined /></Button>
                  </div>
                </Card> : null) : (
                  selected == 1 ? 

              <Table
                columns={columns}
                dataSource={indentData}
                rowKey={(record: any) => record?.id}
                size="middle"
                className="mt-2 m-4"
                pagination={false}
              />
            :null)
            }

            <div className='fixed bottom-0 w-full p-4'>
              <Button variant="contained" className='bottom-0 fixed' color="secondary" fullWidth>Submit</Button>
            </div>



          
      {
        visible?.showDate ? (
          <SelectDate callBack={handleDate} open={visible.showDate} onClose={onHide} onOpen={() => onShow("showDate")} dateTime={getValues("date_time")} />
        ) : null

      }
    </div>



  )
}

export default PodPendingCourier