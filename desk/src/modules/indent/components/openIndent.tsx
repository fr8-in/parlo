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
import get from 'lodash/get';
import { useShowHideWithRecord } from '../../../lib/hooks';
import IndentItemContainer from './indentItemContainer';
import CustomDrawer from '../../../common/customDrawer';
import { IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BlankSpace from '../../../common/blankSpace';
import util from '../../../lib/utils';

interface IndentListProps {
    isSelectList?: boolean,
    onChange?: Function,
    selected?: {
        indents: Array<Indent>
        indent_names: Array<string>
    }
}

const IndentTableContainer = (props: IndentListProps) => {
    const { isSelectList, onChange, selected } = props

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
        source_branch:'',
        destination_branch:''
    }

    const [search, setSearch] = useState<SearchType>(initialSearch);

    const initialFilter: FilterType = {
        index: 0,
        series_name: '',
        customer_name:'',
        user_names:[],
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

    useEffect(() => {
        if (selected?.indents) setIndent({ ...indent, indent_names: selected?.indent_names || [], indents: selected?.indents })
    }, [selected?.indent_names?.length])

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
        setIndent({ ...indent, indent_names: selectedRowKeys, indents: selectedRows })
        if (onChange) onChange(selectedRowKeys)
    }

    const rowSelection = {
        fixed: true,
        hideSelectAll: true,
        selectedRowKeys: indent.indent_names,
        onChange: onSelectChange,
        getCheckboxProps: (record: Indent) => {
            // Currently Checked items
            const is_per_case = get(indent, 'indents[0].is_per_case', null)
            const is_per_kg = get(indent, 'indents[0].is_per_kg', null)

            const name = get(indent, 'indents[0].name', null)
            const ftl = is_per_case == 0 && is_per_kg == 0
            const ptl = is_per_case == 1 || is_per_kg == 1

            const row_is_per_case = get(record, 'is_per_case', null)
            const row_is_per_kg = get(record, 'is_per_kg', null)

            const row_ftl = row_is_per_case == 0 && row_is_per_kg == 0
            const row_ptl = row_is_per_case == 1 || row_is_per_kg == 1

            return ({
                disabled: isEmpty(indent.indents) ? false : ((row_ftl && ftl) && (record?.name == name)) ? false : row_ptl && ptl ? false : true
            })
        }
    }
    
    const idFilter: Filter[] = search.id?.length >= 3 ? [['id', 'like', search.id?.length >= 3 ? `%${search.id}%` : '%%']] : []
    const customerSearchFilter: Filter[] = search.customer?.length >= 3 ? [['customer', 'like', search.customer?.length >= 3 ? `%${search.customer}%` : '%%']] : []
    const consigneeFilter: Filter[] = search.consignee?.length >= 3 ? [['consignee', 'like', search.consignee?.length >= 3 ? `%${search.consignee}%` : '%%']] : []
    const sourceFilter: Filter[] = search.source?.length >= 3 ? [['source', 'like', `%${search.source}%`]] : []
    const destinationFilter: Filter[] = search.destination?.length >= 3 ? [['destination', 'like', `%${search.destination}%`]] : []
    const sourceBranchFilter: Filter[] = search.source_branch?.length >= 3 ? [['source_branch', 'like', `%${search.source_branch}%`]] : []
    const destinationBranchFilter: Filter[] = search?.destination_branch.length >= 3 ? [['destination_branch', 'like', `%${search.destination_branch}%`]] : []
    const seriesFilter: any[] = filter.series_name?.length > 0 ? [['series', 'in', filter.series_name]] : []
    const customerFilter: any[] = filter.customer_name?.length > 0 ? [['customer', 'in', filter.customer_name]] : customerSearchFilter
    const userFilter: Filter[] = filter.user_names?.length > 0 ? [['owner', 'in', filter.user_names]] : []
    const truckTypeFilter: Filter[] = filter.truck_type_names?.length > 0 ? [['rate_type', 'in', filter.truck_type_names]] : []

    const { data, error, isValidating, mutate } = useFrappeGetDocList<Indent>(
        'Indent', {
        fields: [
            "cases",
            "confirmed_at",
            "consignee",
            "creation",
            "customer",
            "customer_price",
            "destination",
            "docstatus",
            "expiry_at",
            "from",
            "id",
            "idx",
            "modified",
            "modified_by",
            "name",
            "owner",
            "rate_type",
            "series",
            "source",
            "to",
            "weight",
            "workflow_state",
            "_assign",
            "_comments",
            "_liked_by",
            "_user_tags",
            "rate_type.common_name",
            "trip",
            "rate_type.is_per_case",
            "rate_type.is_per_kg",
            "add_charge",
            "reduce_charge",
            "balance",
            "received",
            "source_branch",
            "destination_branch"
        ],
        filters: [
            ['confirmed_at', "=", null],
            ['deleted_at', "=", null],
            ['assigned_at',"=", null],
            ...idFilter,
            ...consigneeFilter,
            ...sourceFilter,
            ...destinationFilter,
            ...seriesFilter,
            ...customerFilter,
            ...userFilter,
            ...truckTypeFilter,
            ...destinationBranchFilter,
            ...sourceBranchFilter
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
                        rowSelection={rowSelection}
                        mutate={mutate}
                    />)}

            {(isEmpty(indent.indent_names) || isSelectList) ? null : (
                <IndentFabMenu
                    tabKey="Open"
                    selected={indent}
                    reset={handleReset}
                    mutate={mutate}
                />
            )}
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
