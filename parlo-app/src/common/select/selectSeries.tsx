import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useFrappeGetCall, useFrappeGetDoc, useFrappeGetDocList } from "frappe-react-sdk";
import { ListItem } from "../listItem";
import CustomDrawer from "../customDrawer";
import { Empty } from "antd";
import { IconButton, TextField } from "@mui/material";
import { BubbleLoading } from "../bubbleLoading";
import isEmpty from "lodash/isEmpty";
import { useKeyPress } from "../../lib/hooks/useKeyPress";


interface Props {
    callBack: Function;
    open: boolean;
    onClose: Function | any;
    onOpen: Function | any;

}

interface CustomerType {
    series:string ;
    customer_data : any ;
    clicked:boolean ;
    series_name : string ;
}

/**
 * send book name from selection if select
 * Series -> name
 * Lane -> append lane data and get series again
 * Price Master -> get Lane doc and send from, to and series with other data
 * @param props refer interface
 * @returns 
 */

const SelectSeries = (props: Props) => {
    const { open, onClose, callBack, onOpen } = props;

    const [search, setSearch] = useState()
    const initial_lane = { pm: null, name: '', type: '' }
    const [lane, setLane] = useState<any>(initial_lane)
    const initial_customer = {  series:"", customer_data:[] , clicked:false , series_name:"" }
    const [customer , setCustomer ] = useState<CustomerType>(initial_customer)
    const { data,mutate , isLoading : api_loading} = useFrappeGetCall<any>('parlo.trip.api.getShortNameList.getShortNameList', {
        shortNameListInput: {
            short_name: search || ""
        }
    })
    
    useEffect(() => {
        console.log({search});
        mutate()
    },[search])

    const message = data?.message

    // const { series, lanes, priceMasters } = message
    const series = message?.series
    const lanes: any = message?.lanes
    const priceMasters: any = message?.priceMasters

    const { data : customer_naming_series_data ,isLoading:customer_series_loading , mutate:customer_mutate } = useFrappeGetDocList(
        'Customer Naming Series',
        {
          fields: ["customer"],
          filters: [['naming_series', '=', `${customer.series_name}`]],
          limit : 2
        }
      );

      /**
       * @author Prasanth
       * @param value - Selected Series
       * When a series is selected a network call is made to get the Customer that are under the series.
       * If the length of the customer array is 1 , then the customer will be populated in the form.
       * The limit of the query call is set to 2 , sincle we are checking only for length 1 , so we dont need to fetch all the data.
       */
    const onSeriesOk = (value: any) => {
        setCustomer({...customer ,series_name:value.name , clicked : true})
        customer_mutate()
    }; 

    useEffect(()=>{
            if(!customer_series_loading && customer.clicked){
                let _customer = null
                if(!isEmpty(customer_naming_series_data) && customer_naming_series_data?.length == 1 ){
                    _customer = customer_naming_series_data[0].customer
                }
                callBack({
                        series_name: customer.series_name,
                        customer : _customer ,
                    ...(lane.pm?.from ? { from: lane.pm?.from } : {}),
                    ...(lane.pm?.to ? { to: lane.pm?.to } : {})
                });
                onClose();
                setLane(initial_lane)
                setCustomer({...customer , clicked : false})
            }
        },[ customer.clicked , customer_series_loading ])

    const onLaneOk = (value: any) => {
        setLane({...lane, pm:value, type:'Lane'})
    };

    const { data:lane_data, isLoading:lane_loading } = useFrappeGetDoc<any>('Lane', lane.name)

    /** If price master selected 
     * 1. we have to get from and to location from "Lane" doctype
     * so handleLane setLane name after state change we get lane_data 
     * then callback is called
     */
    useEffect(()=>{
        if (!lane_loading) {
            if ((lane_data && lane_data.name) && lane.name) {
                callBack({ ...lane.pm, from: lane_data?.from, to: lane_data?.to, series_name: lane.pm?.series, type:'pm' });
                onClose();
            } else if (lane.name) {
                callBack({...lane.pm , type:'pm'});
                onClose();
            }
        }
    }, [lane.name, lane_loading])

    const handleLane = (value: any) => {
        setLane({ ...lane, pm: value, name: value?.lane })
    }

    //When escape key is pressed , onClose function is triggered.
    useKeyPress('Escape',onClose);

    return (
        <CustomDrawer
            open={open}
            onClose={onClose}
            onOpen={onOpen}
            type="full"
            backdropClose={false}
        >
            <div>
                <div className="flex justify-between items-center p-3 h-16 gap-3">
                    <IconButton className="mt-3" disabled={customer.clicked && customer_series_loading} onClick={onClose}>
                        <ArrowBackIcon />
                    </IconButton>
                    <TextField
                        className="w-full"
                        variant='standard'
                        placeholder="Search Customer Location (Min 3 Letters)"
                        autoFocus
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                    />
                </div>
              { customer_series_loading || api_loading || lane_loading ? <BubbleLoading /> :  <div className=" border-t overflow-y-auto">
                    {lane.type === 'Lane' ? <p className="pl-4 py-0.5">Select Series</p> : <p className="text-[10px] font-bold text-slate-600 bg-blue-100 pl-4 py-0.5 uppercase">Series</p>}
                    {series?.length == 0 ? <Empty /> :
                        series?.map((series: any, index: number) => {
                            return (
                                <ListItem
                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                    key={index}
                                    title={series?.name}
                                    secondary={series?.series}
                                    handleClick={() => onSeriesOk(series)} />
                            )
                        })
                    }
                    {lane.type === 'Lane' ? null : <>
                    <p className="text-[10px] font-bold text-slate-600 bg-blue-100 pl-4 py-0.5 uppercase">Lane</p>
                    {lanes?.length == 0 ? <Empty /> :
                        lanes?.map((ln: any, index: number) => {
                            return (
                                <ListItem
                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                    key={index}
                                    title={ln?.short_name}
                                    secondary={ln?.series}
                                    handleClick={() => onLaneOk(ln)} />
                            )
                        })
                    }
                    <p className="text-[10px] font-bold text-slate-600 bg-blue-100 pl-4 py-0.5 uppercase">Price Master</p>
                    {priceMasters?.length == 0 ? <Empty /> :
                        priceMasters?.map((pm: any, index: number) => {
                            return (
                                <ListItem
                                    classes={"even:bg-white odd:bg-slate-50 h-14"}
                                    key={index}
                                    title={pm?.short_name}
                                    secondary={pm?.series}
                                    handleClick={() => handleLane(pm)} />
                            )
                        })
                    }</>}
                </div>}
            </div>
        </CustomDrawer>
    );
};

export default SelectSeries;