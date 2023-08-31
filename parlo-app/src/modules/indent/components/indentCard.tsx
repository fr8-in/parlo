import { Button, Checkbox, Divider, IconButton, Paper, Stack } from "@mui/material";
import util from "../../../lib/utils";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Indent } from "../../../lib/types/indent";
import { SourceDestination } from "../../../common/sourceDestination";
import { TitleAndLabel } from "../../../common/titleAndLabel";
import constants from "../../../lib/constants";
import { Space } from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { blue, blueGrey } from "@mui/material/colors";
import { UploadFile } from "@mui/icons-material";
import { useShowHide } from "../../../lib/hooks";
import LrEwayTab from "../../trip/components/lrEwayTab";

interface IndentCardProps {
    indent: Indent
    onSelect: any
    selected: any
    showItems: Function
    hideLrEway?: boolean
    mutate: Function
    elevation?:boolean
    hideItems?:boolean
}

const IndentCard = (props: IndentCardProps) => {

    const { indent, onSelect, selected, showItems, hideLrEway = false, mutate , elevation = true , hideItems} = props
    const hrs = indent?.expiry_at ? util.getHours(indent?.expiry_at) : 0

    const status = indent?.workflow_state
    const is_checked = selected.indent_names?.includes(indent?.name);

    const initial = {
        showLrEwayTab: false,
        showUploadPod: false
    };
    const { visible, onHide, onShow } = useShowHide(initial);

    // Currently Checked items
    const is_per_case = get(selected, 'indents[0].is_per_case', null)
    const is_per_kg = get(selected, 'indents[0].is_per_kg', null)
    const name = get(selected, 'indents[0].name', null)
    const ftl = is_per_case == 0 && is_per_kg == 0
    const ptl = is_per_case == 1 || is_per_kg == 1

    const row_is_per_case = get(indent, 'is_per_case', null)
    const row_is_per_kg = get(indent, 'is_per_kg', null)

    const row_ftl = row_is_per_case == 0 && row_is_per_kg == 0
    const row_ptl = row_is_per_case == 1 || row_is_per_kg == 1

    const disabled = isEmpty(selected.indents) ? false : ((row_ftl && ftl) && (indent?.name == name)) ? false : row_ptl && ptl ? false : true

    const showExpiryAt = constants.CREATED_STATUS
    
    return (
        <Paper sx={{ p: 1 }} elevation={elevation ? 1 : 0}>
            <div className="flex justify-between mb-2">
                <p className="text-xs">
                    {indent?.id} | {indent?.owner}
                </p>
                <p className="text-xs">
                    {indent?.creation ? util.formatDate(indent?.creation, constants.DDMMMYYHHmm) : '-'}
                </p>
            </div>
            <Divider sx={{ mb: 1 }} />
            <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                <Space>
                    {onSelect ? <Checkbox
                        checked={is_checked}
                        onChange={() => onSelect(indent?.name, !is_checked)}
                        inputProps={{ "aria-label": "controlled" }}
                        disabled={disabled}
                        sx={{ '&.Mui-disabled': { backgroundColor: blueGrey[50] } }}
                        size="small"
                        color="secondary"
                    /> : null}
                    <SourceDestination customer_name={indent?.customer} consignee_name={indent?.consignee} source_name={indent?.source} destination_name={indent?.destination} />
                </Space>
                <p>&#8377;{indent?.customer_price}</p>
            </Stack>
            <Divider sx={{ mt: 1 }} />
            <div className="flex items-center">
                <TitleAndLabel title="Cases" label={indent?.cases} index={1} className="flex-[0.7]" />
                <TitleAndLabel title="Weight" label={indent?.weight} index={1} className={`border-x flex-[0.7]`} />
                <TitleAndLabel title="type" label={indent?.rate_type || '-'} index={1} className={`${ showExpiryAt ? "border-r flex-1" : "flex-1"}`} />
                {showExpiryAt ? <TitleAndLabel title="Exp.at (hrs)" label={<p className={hrs <= 0 ? 'text-green-700' : 'text-red-700'}>
                    {hrs <= 0 ? Math.abs(hrs) : `-${hrs}`}
                </p>} index={1} className="flex-[0.7]" /> : null}

             { hideItems ? null : <IconButton sx={{ backgroundColor: blue[100], borderRadius: 10 }} size="small" onClick={() => showItems('showItems', '', 'item_name', indent?.name)}>
                    <NavigateNextIcon color="secondary" fontSize="small" onClick={() => showItems('showItems', '', 'item_name', indent?.name)} />
                </IconButton>}
            </div>
            <Divider sx={{ mb: 1 }} />

            {hideLrEway ? null :
                <div className="p-2">
                    {status == "Confirmed" ?
                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                            {indent?.lr_no != null ?
                                <p className='text-sm text-blue-500'
                                    onClick={() => { onShow("showLrEwayTab") }}>Lr: {indent?.lr_no}
                                    <NavigateNextIcon color="secondary" fontSize="small" onClick={() => onShow("showLrEwayTab")} />
                                </p>
                                : null}
                            <div >
                                {indent?.way_bill_no == null ?
                                    <Button
                                        endIcon={<UploadFile />}
                                        size="small"
                                        fullWidth
                                        variant="outlined"
                                        onClick={() => {
                                            onShow("showLrEwayTab")
                                        }}>
                                        LR/E-way
                                    </Button>
                                    : <>
                                        <p className='text-sm text-blue-500'
                                            onClick={() => { onShow("showLrEwayTab") }}>E-way: {indent?.way_bill_no}
                                            <NavigateNextIcon color="secondary" fontSize="small" onClick={() => onShow("showLrEwayTab")} />
                                        </p>
                                    </>}
                            </div>
                        </Stack>
                        : null}
                </div>
            }
            {
                visible.showLrEwayTab ? (

                    <div style={{ overflow: 'auto' }}>
                        <LrEwayTab 
                        open={visible.showLrEwayTab} 
                        handleCancel={onHide} 
                        indentId={indent?.name} 
                        lrNo={indent?.lr_no} 
                        eWay={indent.way_bill_no}
                        mutate={mutate} />
                    </div>

                ) : null
            }
        </Paper>
    )
}

export default IndentCard;
