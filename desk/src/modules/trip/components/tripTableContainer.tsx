
import { Filter, useFrappeGetDocList } from 'frappe-react-sdk';
import { get, isEmpty } from 'lodash';
import React, { ChangeEvent, useState } from 'react'
import { TripSearchType, SorterType, Trip, TripType } from '../../../lib/types/trip';
import TripFabMenu from './tripFabMenu';
// import { useTheme } from '@mui/material/styles';
// import { useMediaQuery } from '@mui/material';
import { Loading } from '../../../common/loading';
// import TripCard from './tripCard';
import { useShowHide } from '../../../lib/hooks';
import Invoice from './invoice';
import TripTable from './tripTable';

interface Props {
    tabKey: string
}
const TripTableContainer = (props: Props) => {
    const { tabKey } = props;

    // const theme = useTheme()
    // const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const initialSearch: TripSearchType = {
        id: '',
        source: '',
        destination: '',
        truck_no: '',
        supplier: '',
        supplierName: ''
    }
    const [search, setSearch] = useState(initialSearch)
    const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
        setSearch({ ...search, [key]: e.target.value })
    }

    const tripInitial: TripType = {
        trip_names: [],
        trips: []
    }

    const [trip, setTrip] = useState<TripType>(tripInitial)

    const tabFilter: any = {
        Active: [["delivered_at", "=", null]],
        Delivered: [["delivered_at", "!=", null], ["invoiced_at", "=", null]],
        All: []
    }
    const idFilter: Filter[] = search.id?.length >= 3 ? [['id', 'like', `%${search.id}%`]] : []
    const sourceFilter: Filter[] = search.source?.length >= 3 ? [['source', 'like', `%${search.source}%`]] : []
    const destinationFilter: Filter[] = search.destination?.length >= 3 ? [['destination', 'like', `%${search.destination}%`]] : []
    const supplierSearch: Filter[] = search.supplier?.length >= 3 ? [['supplier', 'like', `%${search.supplier}%`]] : []
    const supplierFilter = search.supplierName?.length > 0 ? [['supplier', '=', search.supplierName]] : supplierSearch
    const sorterInitial: SorterType = { field: "id", order: "desc" }
    const [sorter, setSorter] = useState<SorterType>(sorterInitial)
    const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
        setSorter({ ...sorter, field, order })
    }

    const { data, error, isValidating, mutate } = useFrappeGetDocList<Trip>(
        'Trip',
        {
            /** Fields to be fetched - Optional */
            fields: [
                "driver.cell_number",
                "cases",
                "confirmed_at",
                "creation",
                "destination",
                "driver",
                "id",
                "idx",
                "invoiced_at",
                "modified",
                "modified_by",
                "name",
                "owner",
                "series",
                "source",
                "supplier",
                "truck",
                "supplier_price",
                "indent_count",
                "weight",
                "workflow_state",
                "add_charge",
                "reduce_charge",
                "paid",
                "balance",
                "_assign",
                "_comments",
                "_liked_by",
                "_user_tags"],
            filters: [
                ["deleted_at", "=", null],
                ...tabFilter[tabKey],
                ...idFilter,
                ...sourceFilter,
                ...destinationFilter,
                ...(supplierFilter)
            ],
            orderBy: sorter.order ? sorter : sorterInitial
        }
    );

    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        const supplier = get(selectedRows,'[0].supplier',null)
        setSearch({...search,supplierName:supplier})
        setTrip({ ...trip, trip_names: selectedRowKeys, trips: selectedRows, })
    }

    const rowSelection = {
        fixed: true,
        hideSelectAll: true,
        selectedRowKeys: trip.trip_names,
        onChange: onSelectChange,
    }

    const handleReset = () => { setTrip(tripInitial) }

    // const handleIndentChange = (trip_name: number, checked: boolean) => {
    //     if (checked) {
    //         const selected = !data || isEmpty(data)
    //             ? []
    //             : data.filter((trip: any) => trip.name === trip_name);
    //         setTrip((prev: any) => ({
    //             ...prev,
    //             trip_names: [...prev.trip_names, trip_name],
    //             trips: [...prev.trips, ...selected],
    //         }));
    //     } else {
    //         setTrip((prev: any) => ({
    //             ...prev,
    //             trip_names: prev.trip_names.filter((in_name: any) => in_name !== trip_name),
    //             trips: prev.trips.filter((trip: any) => trip.name !== trip_name),
    //         }));
    //     }
    // };

    const initial = { showInvoice: false };
    const { visible, onHide, onShow } = useShowHide(initial);

    return (
        <div>
            {isValidating ? <Loading /> :
                /** TODO mobile card view */
                // isMobile ? (
                //     <div className='grid grid-cols-1 md:grid-cols-2 gap-2 p-1' >
                //         {(data && data.length > 0)
                //             ? data.map((_data: any) => {
                //                 return (
                //                     <TripCard
                //                         tripData={_data}
                //                         key={_data.id}
                //                         selected={trip}
                //                         onSelect={handleIndentChange}
                //                     />
                //                 )
                //             }) : <Empty />
                //         }
                //     </div>) : (
                <TripTable
                    rowSelection={rowSelection}
                    dataSource={data}
                    sorter={sorter}
                    search={search}
                    handleSearch={handleSearch}
                    handleSorter={handleSorter}
                    tabKey={tabKey}
                />
                // )
            }
            {(isEmpty(trip.trip_names)) ? null : (
                <TripFabMenu selected={trip} reset={handleReset} showInvoice={onShow} mutate={mutate} />
            )}
            {visible.showInvoice ?
                <Invoice open={visible.showInvoice} onClose={onHide} items={trip.trip_names} /> : null
            }
        </div>
    )
}

export default TripTableContainer
