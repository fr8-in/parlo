import { Filter, useFrappeGetDocList } from 'frappe-react-sdk';
import React, { ChangeEvent, useEffect, useState } from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import blue from '@mui/material/colors/blue';
import { IndentPaymentRequestType, SorterType } from '../../../lib/types/trip';
import { useShowHideWithRecord } from '../../../lib/hooks/useShowHideWithRecord';
import { Loading } from '../../../common/loading';
import FabMenu from '../../../common/fabMenu';
import { Stack } from '@mui/system';
import IndentPaymentRequestTable from './indentPaymentRequestTable';
import constants from '../../../lib/constants';
import ProcessIndentAdvanceModal from './processIndentAdvanceModal';


interface IndentPaymentRequestContainerTypes {
  SearchType: {
    customer: string;
    payment_type: Array<string> ;
  };
  showHideRecordType: {
    showProcessModal: boolean;
    processModalData: Array<IndentPaymentRequestType>
  },
  selectedRequestState: {
    intentRequest: Array<IndentPaymentRequestType>;
    selectedRowKeys: string[];
  }
}

/**
 * @author Prasanth.M
 * @returns Jsx.Elemet IndentPaymentRequestContainer
 */
const IndentPaymentRequestContainer = () => {

  //Initial values
  const sorterInitial: SorterType = { field: "name", order: "desc" }
  const initialSearch: IndentPaymentRequestContainerTypes['SearchType'] = { customer: '' , payment_type : ["Advance","On Delivery"] }
  const showHideInitial: IndentPaymentRequestContainerTypes['showHideRecordType'] = {
    showProcessModal: false,
    processModalData: []
  }
  const selectedRequestInital: IndentPaymentRequestContainerTypes['selectedRequestState'] = {
    intentRequest: [],
    selectedRowKeys: []
  }

  //ShowHide
  const { handleHide, handleShow, object } = useShowHideWithRecord(showHideInitial)

  //States
  const [sorter, setSorter] = useState<SorterType>(sorterInitial)
  const [search, setSearch] = useState<IndentPaymentRequestContainerTypes['SearchType']>(initialSearch)
  const [open, setOpen] = React.useState(false);

  const [selectedRequest, setSelectedRequest] = useState<IndentPaymentRequestContainerTypes['selectedRequestState']>(selectedRequestInital)

  //Handler Functions
  const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
    setSorter({ ...sorter, field, order })
  }

  const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
    setSearch({ ...search, [key]: e.target.value })
  }

  const handleSelectRow = (selectedRowKeys: any, selectedRows: any[]) => {
    setSelectedRequest({ ...selectedRequest, intentRequest: selectedRows, selectedRowKeys: selectedRowKeys })
  }
  const handleReset = () => {
    setSelectedRequest(selectedRequestInital)
    setOpen(prev => !prev);
  };

  const onStatusFilter = (data: any) => {
    setSearch({ ...search, payment_type: data })
}

  //use effect to handle ProcessBankRequestModal open when trip is selected.
  const selected_intent_request_length = selectedRequest.intentRequest.length
  useEffect(() => {
    setOpen(!!selected_intent_request_length);
  }, [selected_intent_request_length]);


  //Fab Actions
  const fabActions = [
    {
      icon: <CurrencyRupeeIcon />,
      name: "Confirm",
      f_props: {
        color: "white",
        bgcolor: blue[600],
        "&:hover": {
          bgcolor: blue[400],
        },
      },
      handleClick: () => handleShow('showProcessModal', '', 'processModalData', selectedRequest.intentRequest),
    },
  ]

  //table Row Selection
  const rowSelection = {
    fixed: true,
    hideSelectAll: true,
    selectedRowKeys: selectedRequest.selectedRowKeys,
    onChange: handleSelectRow,
    getCheckboxProps: (record:IndentPaymentRequestType) => ({
      disabled: [constants.STATUS_CANCELLED,constants.STATUS_APPROVED].includes(record.status),
    })
  }

  //Filters
  const customerFilter: Filter[] = search.customer?.length >= 3 ? [['customer', 'like', `%${search.customer}%`]] : []
  const selectedRowFilter = selectedRequest.intentRequest.length ? [['payment_type', '=', selectedRequest.intentRequest[0].payment_type],["customer","=",selectedRequest.intentRequest[0].customer]]: [["payment_type","in",search.payment_type]];
  
  //Query Call
  const { data:payment_req_data, mutate,isLoading  } = useFrappeGetDocList<IndentPaymentRequestType>(
    'Indent Payment', {
    fields: ["*"],
            filters: [
                ["status","=","requested"],
                ...customerFilter , 
                ...selectedRowFilter ],
            orderBy: sorter.order ? sorter : sorterInitial
})

  return (
    <>
      {isLoading ? <Loading /> :
        <Stack>
          <IndentPaymentRequestTable
            dataSource={payment_req_data}
            handleSorter={handleSorter}
            sorter={sorter}
            search={search}
            searchHandler={handleSearch}
            rowSelection={rowSelection}
            handleFilter={onStatusFilter}
            mutate={mutate}
          />
      
      {open ? <FabMenu open={open} handleReset={handleReset} actions={fabActions} /> : null}
      {
        object.showProcessModal ? (
          <ProcessIndentAdvanceModal
            open={object.showProcessModal}
            handleCancel={handleHide}
            dataSource={object.processModalData}
            mutate={mutate}
            handleReset={handleReset}
            />
        ) : null
      }
        </Stack>
      }
    </>
  )
}

export default IndentPaymentRequestContainer