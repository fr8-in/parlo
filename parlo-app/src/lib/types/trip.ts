export interface Trip {
  cell_number: number | null
  cases: number
  confirmed_at: string
  creation: string
  destination: string
  driver: string
  id: string
  idx: number
  modified: string
  modified_by: string
  name: string
  owner: string
  series: string | null
  source: string
  supplier: string
  truck: string
  supplier_price: number
  weight: number
  workflow_state: string
  add_charge: number
  reduce_charge: number
  paid: number
  invoiced_at:number
  indent_count:number
  assigned_at:string
  balance: number
  _assign?: any
  _comments?: any
  _liked_by?: any
  _user_tags?: any
}

export declare interface PaymentType {
  name: string,
  creation: string,
  modified: string,
  modified_by: string,
  owner: string,
  docstatus: number,
  idx: number,
  payment_mode: string,
  payment_type: string,
  amount: number,
  journal_entry: string,
  customer: string,
  supplier: string,
  date: string,
  _user_tags?: any,
  _comments?: any,
  _assign?: any,
  _liked_by?: any,
  status: string,
  company_bank: string | null,
  supplier_bank: string | null,
  ref_no: string | null,
  remark: string | null,
  remarks: string,
  fuel_station: string | null
}

export declare interface Invoice {
  name: string
  creation: string
  modified: string
  modified_by: string
  owner: string
  docstatus: number
  idx: number
  supplier: string
  add_charge: number
  reduce_charge: number
  total: number
  balance: number
  trip_count: number
  supplier_amount: number
  paid: number
  _user_tags?: any
  _comments?: any
  _assign?: any
  _liked_by?: any
  deleted_at: any
  deleted_by: any
  cases: number
  weight: number
  journal_entry: string
  status: string
}
export interface TripSearchType {
  id: string
  source: string
  destination: string
  truck_no: string
  supplier: string
  supplierName: string
}
export interface TripType {
  trip_names: string[]
  trips: Trip[]
}
export interface RowType {
  names: string[]
  items: Invoice[]
}
export interface SorterType {
  field: string,
  order: "asc" | "desc" | undefined
}

export interface TripChargeType {
  charge_type: string
  name: string
  customer_amount: number
  supplier_amount: any
  driver_amount: number
  remarks: string


}

export interface BankRequestType {
  trip_id:any;
  payment_type:string;
  supplier:string;
  supplier_bank:any;
  creation:string;
  amount:number;
  name:string;
  company_bank:string
  trip:string;
}

export interface FuelRequestType {
  supplier:string;
  name:string;
  creation:string;
  modified:string;
  modified_by:string;
  owner:string;
  docstatus:any;
  idx:number;
  trip:any;
  trip_id:string;
  fuel_station:string;
  fuel_lts:number;
  fuel_rate:number;
  _user_tags:any;
  _comments:string;
  _assign:any;
  _liked_by:any;
  status:string;
  cash:number;
  fuel_amount:number;
  delete_at:string | null;
  delete_by:string|null;
  journal_entry:any;
}


export type PaymentDetailsType = {
  amount: number ;
  creation: string ;
  date: string ;
  name: string ;
  payment_mode: string;
  payment_type: string;
  remarks: string;
  status: string;
  ifsc_code: string;
  bank: any;
  add_charge: number;
  reduce_charge: number;
  ref_no: any;
  paid: number;
  balance: number;
  price: number;
}

export type IndentPaymentRequestType = {
    payment_type : string ;
    name : string ;
    created_at : string ;
    created_by : string ;
    customer : string ;
    intent_id : string ;
    amount : number ;
    status : string ;
    company_bank:string
    indent:string
}

export type SupplierPaymentDetailsType = {
  amount: number ;
  creation: string ;
  date: string ;
  name: string ;
  payment_mode: string;
  payment_type: string;
  remarks: string;
  status: string;
  ifsc_code: string;
  supplier_bank: any;
  add_charge: number;
  reduce_charge: number;
  ref_no: any;
  paid: number;
  balance: number;
  supplier_price: number;
}