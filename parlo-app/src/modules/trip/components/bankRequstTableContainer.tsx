import { Filter, useFrappeGetDocList } from 'frappe-react-sdk';
import React, { ChangeEvent, useEffect, useState } from 'react'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import blue from '@mui/material/colors/blue';
import DeleteIcon from '@mui/icons-material/Delete';
import red from '@mui/material/colors/red';
import { BankRequestType, SorterType } from '../../../lib/types/trip';
import { useShowHideWithRecord } from '../../../lib/hooks/useShowHideWithRecord';
import BankRequestTable from './bankRequestTable';
import { Loading } from '../../../common/loading';
import FabMenu from '../../../common/fabMenu';
import ProcessBankRequestModal from './processBankRequestModal';
import { Stack } from '@mui/system';

interface BankRequestContainerVariableTypes {
  SearchType: {
    supplier: string
  };
  showHideRecordType: {
    showProcessModal: boolean;
    processModalData: Array<any>
  },
  tripsState: {
    trips: Array<BankRequestType>;
    selectedRowKeys: string[];
  }
}

const BankRequestTableContainer = () => {

  //Initial values
  const sorterInitial: SorterType = { field: "payment_type", order: "desc" }
  const initialSearch: BankRequestContainerVariableTypes['SearchType'] = { supplier: '' }
  const showHideInitial: BankRequestContainerVariableTypes['showHideRecordType'] = {
    showProcessModal: false,
    processModalData: []
  }
  const tripInitial: BankRequestContainerVariableTypes['tripsState'] = {
    trips: [],
    selectedRowKeys: []
  }

  //ShowHide
  const { handleHide, handleShow, object } = useShowHideWithRecord(showHideInitial)

  //States
  const [sorter, setSorter] = useState<SorterType>(sorterInitial)
  const [search, setSearch] = useState<BankRequestContainerVariableTypes['SearchType']>(initialSearch)
  const [open, setOpen] = React.useState(false);

  const [selectedTrips, setSelectedTrips] = useState<BankRequestContainerVariableTypes['tripsState']>(tripInitial)

  //Handler Functions
  const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
    console.log(field, order)
    setSorter({ ...sorter, field, order })
  }

  const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
    setSearch({ ...search, [key]: e.target.value })
  }

  const handleSelectRow = (selectedRowKeys: any, selectedRows: BankRequestType[]) => {
    setSelectedTrips({ ...selectedTrips, trips: selectedRows, selectedRowKeys: selectedRowKeys })
  }
  const handleReset = () => {
    setSelectedTrips(tripInitial)
    setOpen(prev => !prev);
  };

  //use effect to handle ProcessBankRequestModal open when trip is selected.
  const selected_trips_length = selectedTrips.trips.length
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
      handleClick: () => handleShow('showProcessModal', '', 'processModalData', selectedTrips.trips),
    },
  ]

  //table Row Selection
  const rowSelection = {
    fixed: true,
    hideSelectAll: true,
    selectedRowKeys: selectedTrips.selectedRowKeys,
    onChange: handleSelectRow,
  }

  //Filters
  const supplierFilter: Filter[] = search.supplier?.length >= 3 ? [['supplier', 'like', `%${search.supplier}%`]] : []
  const rowSelectFilter:Filter[] = selectedTrips.trips.length ? [['supplier',"=",selectedTrips.trips[0].supplier],['supplier_bank','=',selectedTrips.trips[0].supplier_bank]] : []

  //Query Call
  const { data, error, isValidating, mutate, loading } = useFrappeGetDocList<BankRequestType>(
    'Trip Payment',
    {
      fields: [
        "payment_type",
        "creation",
        "supplier",
        "supplier_bank",
        "trip_id",
        "amount",
        "trip",
        "name",
        "company_bank",
      ],
      filters: [
        ["status", "=", "requested"],
        ...supplierFilter,
        ...rowSelectFilter
      ],
      orderBy: sorter.order ? sorter : sorterInitial
    })

    console.log("data",data)

  return (
    <>
      {loading ? <Loading /> :
        <Stack>
          <BankRequestTable
            dataSource={data}
            handleSorter={handleSorter}
            sorter={sorter}
            search={search}
            searchHandler={handleSearch}
            rowSelection={rowSelection} 
            mutate={mutate}          />
        </Stack>
      }
      {open ? <FabMenu open={open} handleReset={handleReset} actions={fabActions} /> : null}
      {
        object.showProcessModal ? (
          <ProcessBankRequestModal
            open={object.showProcessModal}
            handleCancel={handleHide}
            dataSource={object.processModalData}
            mutate={mutate}
            handleReset={handleReset}
            />
        ) : null
      }
    </>
  )
}

export default BankRequestTableContainer