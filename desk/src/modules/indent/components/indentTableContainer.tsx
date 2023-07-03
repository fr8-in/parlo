import { Empty } from 'antd';
import { Filter, useFrappeGetDocList } from 'frappe-react-sdk';
import { ChangeEvent, useEffect, useState } from 'react';
import IndentCard from './indentCard';
import { FilterType, Indent, IndentType, SearchType, SorterType } from '../../../lib/types/indent';
import { Loading } from '../../../common/loading';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import isEmpty from 'lodash/isEmpty';
import IndentTable from './indentTable';
import IndentFabMenu from './indentFabMenu';
import { useShowHide, useShowHideWithRecord } from '../../../lib/hooks';
import IndentItemContainer from './indentItemContainer';
import CustomDrawer from '../../../common/customDrawer';
import { IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BlankSpace from '../../../common/blankSpace';
import util from '../../../lib/utils';
import IndentInvoice from './indentInvoice';
import get from 'lodash/get';

interface IndentListProps {
    tabKey: string
}

const IndentTableContainer = (props: IndentListProps) => {
    const { tabKey } = props

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const initial = { showItems: false, item_name: '' }
    const { object, handleHide, handleShow } = useShowHideWithRecord(initial)

    const initialSearch: SearchType = {
        id: '',
        customer: '',
        source: '',
        consignee: '',
        destination: '',
    }

    const [search, setSearch] = useState<any>(initialSearch);

    const initialFilter: FilterType = {
        index: 0,
        series_name: '',
        customer_name: '',
        user_names: [],
        truck_type_names: [],
    };

    const [filter, setFilter] = useState(initialFilter);

    const filter_cookie = util.getDecryptCookies("filter")
    const _filter = isEmpty(filter_cookie) ? initialFilter : filter_cookie;

    const handleCookieChange = (filter: FilterType) => {
        setFilter(filter)
    };

    useEffect(() => {
        setFilter(_filter)
        util.startCookieListener(handleCookieChange, 'filter')
    }, [])


    const handleSearch = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: string) => {
        setSearch({ ...search, [key]: e.target.value })
    }

    const sorterInitial: SorterType = { field: "id", order: "desc" }
    const [sorter, setSorter] = useState<SorterType>(sorterInitial)
    const handleSorter = (field: string, order: "asc" | "desc" | undefined) => {
        setSorter({ ...sorter, field, order })
    }

    const indentInitial: IndentType = { indent_names: [], indents: [] };
    const [indent, setIndent] = useState<IndentType>(indentInitial);

    const onSelectChange = (selectedRowKeys: any, selectedRows: any) => {
        const customer:string = get(selectedRows,'[0].customer',null)
        const series:string = get(selectedRows,'[0].series',null)
        setFilter({...filter, customer_name:customer,series_name:series})
        setIndent({ ...indent, indent_names: selectedRowKeys, indents: selectedRows })
    }

    const initialShow = { showInvoice: false };
    const { visible, onHide, onShow } = useShowHide(initialShow);

    const rowSelection = {
        fixed: true,
        hideSelectAll: true,
        selectedRowKeys: indent.indent_names,
        onChange: onSelectChange,
        getCheckboxProps: (record: Indent) => {
            return ({
                disabled: false
            })
        }
    }
    const idFilter: Filter[] = search.id?.length >= 3 ? [['id', 'like', search.id?.length >= 3 ? `%${search.id}%` : '%%']] : []
    const customerSearchFilter: Filter[] = search.customer?.length >= 3 ? [['customer', 'like', search.customer?.length >= 3 ? `%${search.customer}%` : '%%']] : []
    const consigneeFilter: Filter[] = search.consignee?.length >= 3 ? [['consignee', 'like', search.consignee?.length >= 3 ? `%${search.consignee}%` : '%%']] : []
    const sourceFilter: Filter[] = search.source?.length >= 3 ? [['source', 'like', `%${search.source}%`]] : []
    const destinationFilter: Filter[] = search.destination?.length >= 3 ? [['destination', 'like', `%${search.destination}%`]] : []
    const seriesFilter: Filter[] = filter.series_name?.length > 0 ? [['series', '=', filter.series_name]] : []
    const customerFilter: Filter[] = filter.customer_name?.length > 0 ? [['customer', '=', filter.customer_name]] : customerSearchFilter
    const userFilter: Filter[] = filter.user_names?.length > 0 ? [['owner', 'in', filter.user_names]] : []
    const truckTypeFilter: Filter[] = filter.truck_type_names?.length > 0 ? [['rate_type', 'in', filter.truck_type_names]] : []

    const tabFilter: any = {
        Active: [["confirmed_at", "!=", null], ["delivered_at", "=", null]],
        Delivered: [["delivered_at", "!=", null], ["invoiced_at", "=", null]],
        All: []
    }

    const { data, error, isValidating, mutate } = useFrappeGetDocList<Indent>(
        'Indent', {
        fields: [
            "cases",
            "confirmed_at",
            "consignee",
            "creation",
            "confirmed_at",
            "customer",
            "customer_price",
            "delivered_at",
            "destination",
            "docstatus",
            "expiry_at",
            "from",
            "id",
            "idx",
            "invoiced_at",
            "lr_no",
            "modified",
            "modified_by",
            "name",
            "owner",
            "rate_type",
            "series",
            "source",
            "to",
            "weight",
            "way_bill_no",
            "workflow_state",
            "add_charge",
            "reduce_charge",
            "received",
            "balance",
            "_assign",
            "_comments",
            "_liked_by",
            "_user_tags",
            "rate_type.common_name",
            "trip",
            // "trip.id",
            // "trip.name",
            "trip.truck",
            "rate_type.is_per_case",
            "rate_type.is_per_kg",
            "received",
            "balance",
            "add_charge",
            "reduce_charge"
        ],
        filters: [
            ['deleted_at', "=", null],
            ...tabFilter[tabKey],
            ...idFilter,
            ...consigneeFilter,
            ...sourceFilter,
            ...destinationFilter,
            ...seriesFilter,
            ...customerFilter,
            ...userFilter,
            ...truckTypeFilter
        ],
        orderBy: sorter.order ? sorter : sorterInitial
    }
    );

    const handleIndentChange = (indent_name: number, checked: boolean) => {
        if (checked) {
            const selected = !data || isEmpty(data)
                ? []
                : data.filter((indent: any) => indent.name == indent_name);
            setIndent((prev: any) => ({
                ...prev,
                indent_names: [...prev.indent_names, indent_name],
                indents: [...prev.indents, ...selected],
            }));
        } else {
            setIndent((prev: any) => ({
                ...prev,
                indent_names: prev.indent_names.filter((in_name: any) => in_name !== indent_name),
                indents: prev.indents.filter((indent: any) => indent.name !== indent_name),
            }));
        }
    };

    const handleReset = () => {
        setIndent(indentInitial)
    }

    return (
        <>
            {isMobile ?
                isValidating ? <Loading /> :
                    (data && data?.length > 0) ?
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {data?.map((_data: any) => {
                                return (
                                    <IndentCard
                                        indent={_data}
                                        key={_data.id}
                                        onSelect={handleIndentChange}
                                        selected={indent}
                                        showItems={handleShow}
                                        mutate={mutate}
                                    />
                                )
                            })}
                        </div> : <Empty />
                : (
                    <IndentTable
                        data={data}
                        loading={isValidating}
                        sorter={sorter}
                        setSorter={handleSorter}
                        search={search}
                        setSearch={handleSearch}
                        rowSelection={(tabKey === 'Active' || tabKey === 'All') ? undefined : rowSelection}
                        tabKey={tabKey}
                        mutate={mutate}
                    />)}

            {(isEmpty(indent.indent_names)) ? null : (
                <IndentFabMenu
                    tabKey='Delivered'
                    selected={indent}
                    reset={handleReset}
                    mutate={mutate}
                    onShow={onShow}
                />
            )}
            {visible.showInvoice ?
                <IndentInvoice open={visible.showInvoice} onClose={onHide} items={indent.indent_names} parentMutate={mutate} /> : null
            }
            {object.showItems ? (
                <CustomDrawer open={object.showItems} onClose={handleHide} onOpen={handleShow} backdropClose >
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ px: 2, py: 1 }}>
                        <h4>Indent Items</h4>
                        <IconButton onClick={handleHide}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <IndentItemContainer name={object.item_name} />
                    <BlankSpace space={40} />
                </CustomDrawer>
            ) : null}
        </>
    );
}

export default IndentTableContainer
