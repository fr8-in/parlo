import React, { useEffect, useState } from 'react'
import CustomDrawer from '../customDrawer'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import util from '../../lib/utils';
import { blueGrey } from '@mui/material/colors';
import FilterSerial from './filterSerial';
import FilterCustomer from './filterCustomer';
import FilterUser from './filterUser';
import FilterTruckType from './filterTruckType';
import { FilterType } from '../../lib/types/indent';
import { isEmpty } from 'lodash';

interface Props {
    open: boolean
    onClose: any
    onOpen: Function
}

const Filter = (props: Props) => {
    const { open, onClose, onOpen } = props

    const initialFilter: FilterType = {
        index: 0,
        series_names: [],
        customer_names: [],
        user_names: [],
        truck_type_names: [],
    };
    const [state, setState] = useState(initialFilter);

    const filter_cookie = util.getDecryptCookies("filter")
    const filter = isEmpty(filter_cookie) ? initialFilter : filter_cookie;
    useEffect(() => {
        setState(filter)
    }, [])

    const onTabChange = (index: number) => {
        setState({ ...state, index: index });
    };

    const onSeriesSelect = (name: string, isChecked: boolean) => {
        setState((prev: FilterType) => {
            const names = isChecked ? [...prev.series_names, name] : prev.series_names.filter((s_name: string) => s_name !== name)
            return ({ ...prev, series_names: names })
        })
    }
    const onCustomerSelect = (name: string, isChecked: boolean) => {
        setState((prev: FilterType) => {
            const names = isChecked ? [...prev.customer_names, name] : prev.customer_names.filter((c_name: string) => c_name !== name)
            return ({ ...prev, customer_names: names })
        })
    }
    const onUserSelect = (name: string, isChecked: boolean) => {
        setState((prev: FilterType) => {
            const names = isChecked ? [...prev.user_names, name] : prev.user_names.filter((c_name: string) => c_name !== name)
            return ({ ...prev, user_names: names })
        })
    }
    const onTruckTypeSelect = (name: string, isChecked: boolean) => {
        setState((prev: FilterType) => {
            const names = isChecked ? [...prev.truck_type_names, name] : prev.truck_type_names.filter((c_name: string) => c_name !== name)
            return ({ ...prev, truck_type_names: names })
        })
    }

    const filterTypes = [
        {
            name: "Serial",
            appliedCount: state.series_names?.length,
            disable: false,
        },
        {
            name: "Customer",
            appliedCount: state.customer_names?.length,
            disable: false,
        },
        {
            name: "Employee",
            appliedCount: state.user_names?.length,
            disable: false,
        },
        {
            name: "Truck type",
            appliedCount: state.truck_type_names?.length,
            disable: false,
        },
    ];

    const filterComponent = [
        <FilterSerial selected={state.series_names} onSelect={onSeriesSelect} />,
        <FilterCustomer selected={state.customer_names} onSelect={onCustomerSelect} />,
        <FilterUser selected={state.user_names} onSelect={onUserSelect} />,
        <FilterTruckType selected={state.truck_type_names} onSelect={onTruckTypeSelect} />,
    ]

    const onClearFilter = () => {
        util.setEncryptCookies('filter', initialFilter)
        onClose()
    }

    const onApplyFilter = () => {
        util.setEncryptCookies("filter", state);
        onClose()
     }

    return (
        <CustomDrawer open={open} onClose={onClose} onOpen={onOpen} backdropClose type='full' >
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} sx={{ px: 2, py: 1 }}>
                <h4>Filter</h4>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Stack>
            <div
                className="grid grid-cols-3 w-full h-screen sm:h-full border-t border-slate-200"
                style={{ height: "calc(100vh - 128px)" }}
            >
                <div className=" col-span-1">
                    {filterTypes.map((ft, i) => {
                        return (
                            <button
                                className={`p-3 font-semibold text-sm flex w-full text-left justify-between hover:bg-slate-100 ${state.index === i
                                    ? "text-blue-600 bg-slate-50"
                                    : "text-slate-700"
                                    }`}
                                onClick={() => onTabChange(i)}
                                key={i}
                            >
                                <span>{ft.name}</span>
                                <span>{ft.appliedCount || null}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="col-span-2 border-l border-slate-200 overflow-y-auto">
                    {filterComponent[state.index]}
                </div>
            </div>
            <Stack direction={'row'} justifyContent={'end'} alignItems={'stretch'} sx={{ px: 2, py: 1, borderTop: `solid 1px ${blueGrey[50]}` }} gap={3}>
                <Button variant='outlined' onClick={onClearFilter}>
                    Reset
                </Button>
                <Button variant='contained' onClick={onApplyFilter}>
                    Apply
                </Button>
            </Stack>
        </CustomDrawer>
    )
}

export default Filter