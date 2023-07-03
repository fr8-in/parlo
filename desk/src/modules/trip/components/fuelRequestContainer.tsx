import { Filter, useFrappeGetDocList } from 'frappe-react-sdk';
import React, { ChangeEvent, useEffect, useState } from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import blue from '@mui/material/colors/blue';
import { FuelRequestType, SorterType } from '../../../lib/types/trip';
import { useShowHideWithRecord } from '../../../lib/hooks/useShowHideWithRecord';
import { Loading } from '../../../common/loading';
import FabMenu from '../../../common/fabMenu';
import { Stack } from '@mui/system';
import FuelRequestTable from './fuelRequestTable';
import ProcessFuelAdvanceModal from './processFuelAdvanceModal';
import ConfrimFuelRequestToFilledModal from './confrimFuelRequestToFilledModal';
import constants from '../../../lib/constants';

interface FuelRequestContainerVariableTypes {
  SearchType: {
    supplier: string;
    status: Array<string> ;
    fuel_station:string;
  };
  showHideRecordType: {
    showProcessModal: boolean;
    processModalData: Array<FuelRequestType>
  },
  selectedRequestState: {
    fuelRequests: Array<FuelRequestType>;
    selectedRowKeys: string[];
  }
}

/**
 * @author Prasanth.M
 * @returns Jsx.Elemet FuelRequestContainer
 */
const FuelRequestContainer = () => {

  //Initial values
  const sorterInitial: SorterType = { field: "name", order: "desc" }
  const initialSearch: FuelRequestContainerVariableTypes['SearchType'] = { supplier: '' , status : ["Requested","Filled"] , fuel_station:'' }
  const showHideInitial: FuelRequestContainerVariableTypes['showHideRecordType'] = {
    showProcessModal: false,
    processModalData: []
  }
  const selectedRequestInital: FuelRequestContainerVariableTypes['selectedRequestState'] = {
    fuelRequests: [],
    selectedRowKeys: []
  }

  //ShowHide
  const { handleHide, handleShow, object } = useShowHideWithRecord(showHideInitial)

  //States
  const [sorter, setSorter] = useState<SorterType>(sorterInitial)
  const [search, setSearch] = useState<FuelRequestContainerVariableTypes['SearchType']>(initialSearch)
  const [open, setOpen] = React.useState(false);

  const [selectedRequest, setSelectedRequest] = useState<FuelRequestContainerVariableTypes['selectedRequestState']>(selectedRequestInital)

  //Handler Functions
  const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
    setSorter({ ...sorter, field, order })
  }

  const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
    setSearch({ ...search, [key]: e.target.value })
  }

  const handleSelectRow = (selectedRowKeys: any, selectedRows: any[]) => {
    setSelectedRequest({ ...selectedRequest, fuelRequests: selectedRows, selectedRowKeys: selectedRowKeys })
  }
  const handleReset = () => {
    setSelectedRequest(selectedRequestInital)
    setOpen(prev => !prev);
  };

  const onStatusFilter = (data: any) => {
    setSearch({ ...search, status: data })
}

  //use effect to handle ProcessBankRequestModal open when trip is selected.
  const selected_trips_length = selectedRequest.fuelRequests.length
  useEffect(() => {
    setOpen(!!selected_trips_length);
  }, [selected_trips_length]);


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
      handleClick: () => handleShow('showProcessModal', '', 'processModalData', selectedRequest.fuelRequests),
    },
  ]

  //table Row Selection
  const rowSelection = {
    fixed: true,
    hideSelectAll: true,
    selectedRowKeys: selectedRequest.selectedRowKeys,
    onChange: handleSelectRow,
    getCheckboxProps: (record:FuelRequestType) => ({
      disabled: [constants.STATUS_CANCELLED,constants.STATUS_APPROVED].includes(record.status),
    })
  }

  //Filters
  const supplierFilter: Filter[] = search.supplier?.length >= 3 ? [['supplier', 'like', `%${search.supplier}%`]] : []
  const fuelStationSearch: Filter[] = search.fuel_station?.length >= 3 ? [['fuel_station', 'like', `%${search.fuel_station}%`]] : []
  const selectedRowFilter = selectedRequest.fuelRequests.length
  ? [
      ['status', '=', selectedRequest.fuelRequests[0].status],
      ['supplier', '=', selectedRequest.fuelRequests[0].supplier],
      ['fuel_station', '=', selectedRequest.fuelRequests[0].fuel_station]
    ]
  : [];
  
  //Query Call
  const { data:fuel_req_data, mutate ,loading } = useFrappeGetDocList<FuelRequestType>(
    'Trip Fuel', {
    fields: ["supplier",
            "name",
            "creation",
            "modified",
            "modified_by",
            "owner",
            "docstatus",
            "idx",
            "trip",
            "trip_id",
            "fuel_station",
            "fuel_lts",
            "fuel_rate",
            "_user_tags",
            "_comments",
            "_assign",
            "_liked_by",
            "status",
            "cash",
            "fuel_amount",
            "delete_at",
            "delete_by",
            "journal_entry"],
            filters: [["status", "in", search.status] , ...supplierFilter , ...selectedRowFilter , ...fuelStationSearch],
            orderBy: sorter.order ? sorter : sorterInitial
})

  return (
    <>
      {loading ? <Loading /> :
        <Stack>
          <FuelRequestTable
            dataSource={fuel_req_data}
            handleSorter={handleSorter}
            sorter={sorter}
            search={search}
            searchHandler={handleSearch}
            rowSelection={rowSelection}
            handleFilter={onStatusFilter}
            mutate={mutate}
          />
        </Stack>
      }
      {open ? <FabMenu open={open} handleReset={handleReset} actions={fabActions} /> : null}
          {
              (object.showProcessModal && selectedRequest.fuelRequests.length )? (
                 selectedRequest.fuelRequests[0].status == constants.FUEL_REQUEST_STATUS_FILLED
                      ?
                      <ProcessFuelAdvanceModal
                          open={object.showProcessModal}
                          handleCancel={handleHide}
                          dataSource={object.processModalData} 
                          mutate={mutate}
                          handleReset={handleReset}
                          />
                      :
                      <ConfrimFuelRequestToFilledModal
                          open={object.showProcessModal}
                          onClose={handleHide}
                          dataSource={object.processModalData}
                          mutate={mutate}
                          handleReset={handleReset}
                          />
              ) : null
          }
    </>
  )
}

export default FuelRequestContainer