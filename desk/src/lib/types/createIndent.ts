import moment from "moment"
import { Moment } from "moment"
import { TruckType } from "./indent"

export interface CreateIndentFormInterface {
    series: string,
    date: string
    customer: string,
    consignee: string,
    from: string,
    delivery: string,
    select: string,
    customer_price: number | null,
    weight: number | null,
    cases: number | null
    unit_price: number | null,
    rate_type_name: string
    rate_type: TruckType | null
    disabled: boolean,
    on_delivery: number | null,
    billable: number | null,
    advance: number | null
}


export interface MaterialTypeInterface {
    amount?: number;
    id: number
    material_name: string
    bill_no: number
    sap_ref_no: string
    cases: number
    weight: number
    unit_price: number
    price: number
    remarks: string
    item?:Array<MaterialTypeInterface>
}

export interface StateTypeInterface {
    date: Moment
    hours: number
    expiryDate: Moment
    materials: Array<MaterialTypeInterface>
}

export const initialState: StateTypeInterface = {
    date: moment(),
    hours: 48,
    expiryDate: moment().add(48, 'hours'),
    materials: [],
}

export interface CreateIndentPropsInterface {
    onCreateIndent?: Function
    indentDetailData?:any
}

