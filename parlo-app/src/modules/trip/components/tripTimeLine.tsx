import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import util from '../../../lib/utils';
import constants from '../../../lib/constants';
import { useMediaQuery, useTheme } from '@mui/material';
import TripDelivered from './tripDelivered';
import { blue, blueGrey } from "@mui/material/colors";


interface Props {
    tripData: any
    mutate: any
    indentDetail?: boolean
}

const TripTimeLine = (props: Props) => {

    const { tripData, mutate, indentDetail } = props

    const creation = indentDetail ? tripData?.confirmed_at : tripData?.creation
    const delivered = tripData?.delivered_at
    const received = tripData?.pod_received_at
    const paid = tripData?.paid_at
    const status = tripData?.workflow_state
    const invoiced = tripData?.invoiced_at
    const trackingList = [
        ...(indentDetail
          ? [
              {
                tripStatus: "Created",
                date: tripData?.creation || null
              }
            ]
          : []),
        {
          tripStatus: "Confirmed",
          date: creation || null
        },
        {
          tripStatus: "POD Pending",
          date: delivered || null
        },
        {
          tripStatus: indentDetail ? "Invoiced" : "POD Received",
          date: (indentDetail ? invoiced : received) || null
        },
        {
          tripStatus: "Paid",
          date: paid || null
        }
      ];
      
      
    const tatMapper: any = {
        'Confirmed': creation,
        'POD Pending': delivered,
        'POD Received': received,
        'Paid': paid
    }

    const tripTat = util.calculate_tat(tatMapper[status])
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));


    return (
        <div className={isMobile ? "flex flex-col  rounded-t-md bg-white pt-2" : "flex  rounded-t-md bg-white pt-2"}>

            <div className={`flex w-full ${isMobile ? '' : 'mx-auto'} flex-col justify-center`}>
                <p className="text-black font-bold ml-3">
                    {status} | TAT:  <span className="text-green-500">&nbsp;{tripTat}d </span>
                </p>
                <div className="scrollbar overflow-x-auto justify-center w-full text-center mx-auto flex my-2">
                    <div className="flex">
                        {trackingList?.map((_data, i) => {
                            return (
                                <div key={i} className="text-center ">
                                    <div className={`${isMobile ? 'w-24' : 'w-32'} relative`}>
                                        {i === 0 ? (
                                            <div className="w-14 bg-white absolute h-1 top-[10px] z-10"></div>
                                        ) : null}
                                        {trackingList.length === i + 1 ? (
                                            <div className="w-14 bg-white absolute h-1 top-[10px] right-0 z-10"></div>
                                        ) : null}
                                        <div className="border  border-t relative z-0 top-3 w-full"></div>
                                        <div className="mx-auto w-5 h-5 rounded-full relative z-20 bg-white">
                                            {_data?.date ? (
                                                <RadioButtonCheckedIcon
                                                    sx={{ color: blue[600], margin: "-2px" }} />
                                            ) : (
                                                <PanoramaFishEyeIcon
                                                    sx={{ color: blueGrey[300], margin: "-2px" }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <h6 className="font-medium text-sm mt-1">{_data.tripStatus}</h6>
                                    {_data.date ?
                                        <p className=" text-xs ">
                                            {_data?.date ? util.formatDate(_data?.date, constants.DDMMMHHmm) : "-"}
                                        </p>
                                        : null}
                                    <div>
                                    </div>
                                </div>
                            );

                        })}
                    </div>
                </div>
                {indentDetail ? null : <div className="flex self-end">
                    <TripDelivered tripData={tripData} mutate={mutate} />
                </div>}
            </div>

        </div>

    )
}

export default TripTimeLine