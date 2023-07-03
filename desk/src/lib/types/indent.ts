import indent from "../constants/indent"

export interface Indent {
  cases: number
  confirmed_at: string
  consignee: string
  created_at: string
  creation: string
  customer: string
  customer_price: number | null
  common_name: string
  delete_at: string
  deleted_by: string
  delivered_at: string
  destination: string
  docstatus: number
  expiry_at: string
  from: string
  id: string
  idx: number
  indent_date: string
  invoiced_at: string
  is_per_case: number
  is_per_kg: number
  modified: string
  modified_by: string
  name: string
  owner: string
  pod_received_at: string
  rate_type: string
  received_at: string
  series: string
  source: string
  lr_no:any
  way_bill_no:any
  to: string
  workflow_state?: string
  trip: string | null
  weight: number
  _assign: any
  _comments: string
  _liked_by: string
  _user_tags: string
  items: Array<Items>
  add_charge:number
  reduce_charge:number
  balance:number
  received:number
  truck:string;
}

export interface Items {
  bill_no: string
  creation: string
  docstatus: number
  doctype: string
  idx: number
  item: string
  modified: string
  modified_by: string
  name: any
  owner: string
  parent: string
  parentfield: string
  parenttype: string
  rate_type: string
}

export interface SearchType {
  id: string
  customer: string,
  consignee: string,
  source: string,
  destination: string,
}
export interface SorterType {
  field: string,
  order: "asc" | "desc" | undefined
}

export interface IndentType {
  indent_names: string[];
  indents: Indent[];
}

export interface FilterType {
  index: number
  series_name:string
  customer_name: string 
  user_names: Array<string> | []
  truck_type_names: Array<string> | []
}

export interface TruckType {
  code: string
  common_code: string
  common_name: string
  creation: string
  docstatus: number
  idx: number
  is_per_case: number
  is_per_kg: number
  modified: string
  modified_by: string
  name: string
  name1: string
  owner: string
  tonnage: number
  _assign: string | null
  _comments: string | null
  _liked_by: string | null
  _user_tags: string | null
}

export interface Lr {
  lr_no: number
  date:string
  remarks:string
  weight:number
  name:string
  
}
