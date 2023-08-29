import React, { useState } from "react";
import { Button, Checkbox, Divider, Paper, Stack } from "@mui/material";
import { Empty, Modal, Space } from "antd";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { useShowHide, useWindowSize } from "../../../lib/hooks";
import util from "../../../lib/utils";
import constants from "../../../lib/constants";
import { SourceDestination } from "../../../common/sourceDestination";
import { TitleAndLabel } from "../../../common/titleAndLabel";
import { UploadFile } from "@mui/icons-material";
import { Indent, IndentType } from "../../../lib/types/indent";
import UploadPod from "./uploadPod";
import { isEmpty } from "lodash";
import PodFabMenu from "./podFabMenu";

interface Props {
  open: boolean
  handleCancel: any
  tripName: string
  selectedList?:any
  onChange?:any
}

const EditPod = (props: Props) => {
  const { open, handleCancel, tripName } = props;

  const { data, error, isValidating, mutate } = useFrappeGetDocList<Indent>(
    'Indent',
    {
      /** Fields to be fetched - Optional */
      fields: ["*"],
      filters: [['trip', '=', `${tripName}`]],
    }
  );
  const selectedList = props?.selectedList
  const onChange = props?.onChange
  const indentInitial: IndentType = {
    indent_names: [],
    indents: [],

  }

  const getIndent: any = data
  const [state, setState] = useState("")


  const [indent, setIndent] = useState<IndentType>(indentInitial)
  const handleReset = () => {
    setIndent(indentInitial)
  }
  const handleIndentChange = (indent_name: number, checked: boolean) => {
    if (checked) {
        const selected = !data || isEmpty(data)
            ? []
            : data.filter((indent: any) => indent.name === indent_name);
        setIndent((prev: any) => ({
            ...prev,
            indent_names: [...prev.indent_names, indent_name],
            indents: [...prev.indents, ...selected],
        }));

        if (onChange) {
            onChange([...indent.indent_names, indent_name])
        }

    } else {
        setIndent((prev: any) => ({
            ...prev,
            indent_names: prev.indent_names.filter((in_name: any) => in_name !== indent_name),
            indents: prev.indents.filter((indent: any) => indent.name !== indent_name),
        }));
        if (onChange) {
            onChange([...indent.indent_names.filter((in_name: any) => in_name !== indent_name)])
        }
    }
};


  const { height } = useWindowSize()
  const maxHeight = height - 80
  const initial = { showUploadPod: false, Trip: null };
  const { visible, onHide, onShow } = useShowHide(initial);

  const common = { maxWidth: 1200, margin: '0 auto' }
  const mobile = { ...common, top: 0, borderRadius: 0, paddingBottom: 0 }

  
  return (
    <Modal
      open={open}
      title={"Indent"}
      footer={null}
      onCancel={handleCancel}
      style={mobile}
      width="100%"
      className="mobile_overlay"
    >
      {

        (data && data?.length > 0) ?
          <div style={{ height: maxHeight }}>

            {data?.map((_data:any) => {
              return (
                <>
         

                  <div >
                    <Paper sx={{ p: 2 }}>
                

                      <div className='flex justify-between mb-2'>
                        <p className='text-xs'>
                          {_data.id} | {_data.owner}
                        </p>
                        <p className='text-xs'>
                          {_data.creation ? util.formatDate(_data.creation, constants.DDMMMYYHHmm) : '-'}
                        </p>
                      </div>
                      <Divider sx={{ mb: 1 }} />
                      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                        <Space>
                          <Checkbox
                            onChange={() => handleIndentChange(_data?.name, !indent.indent_names?.includes(_data.name))}
                            size="small"
                            color="secondary"
                          />
                          <SourceDestination source_name={_data.source} destination_name={_data.destination} />
                        </Space>
                        <p className='bg-slate-200 '>&#8377;    {_data.customer_price} </p>
                      </Stack>
                      <Divider sx={{ mb: 1 }} />

                      <div className='flex'>
                        <TitleAndLabel title={'Cases'} label={_data.cases} index={1} />
                        <TitleAndLabel title={'Weight'} label={_data.weight} index={1} />
                        <TitleAndLabel title="type" label={_data.rate_type || '-'} index={1} className="border-r flex-1" />
                      </div>
                      <Divider sx={{ mb: 1 }} />
                      <div className="bg-slate-100 w-full rounded-sm p-1">
                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>

                          <div>
                            <p className='text-xs'>{_data.customer}</p>
                            <p className='text-xs'>{_data.consignee}</p>
                          </div>
                          <div className='flex'>

                            <Button endIcon="+" size="small">Material</Button>
                          </div>

                        </Stack>
                      </div>
                      <div className='flex  p-3'>

                        <Button variant="outlined"
                          size="small" fullWidth
                          onClick={() => {
                            setState(_data?.name)
                            onShow("showUploadPod")
                          }}
                        > POD <UploadFile /></Button>
                      </div>




                      {(isEmpty(indent.indent_names) || selectedList) ? null : (
                        <PodFabMenu selected={indent} reset={handleReset} mutate={mutate} indentId={state}/>
                      )}


                    </Paper>
                  </div>


                </>

              )
            }

            )
            }


            {
              visible.showUploadPod ? (

                <UploadPod open={visible.showUploadPod} handleCancel={onHide} indentId={state} />

              ) : null
            }

          </div> : <Empty />
      }
    </Modal>
  )


}

export default EditPod;



