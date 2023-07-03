export declare interface FuelAdvType {
  station_name: string
  liters: number | null
  fuel_rate: number | null
  fuel_total: number | null
  driver_cash: number | null
  total: number
}

export declare interface AdvType {
  mode: string
  amount: number | null
  supplier_bank: string
  remarks: string
}

export declare interface FormProp {
  truck_no: string
  truck: string | null
  driver_name: string
  driver: string | null
  supplier_name: string
  supplier: string | null
  series: string
  source: string
  destination: string
  supplierPrice: number | null
  fuel_advance: Array<FuelAdvType>
  advance: Array<AdvType>
}

export declare interface PaymentType {
  mode: "Bank" | "Cash" | "CPS"
  date?: string
  company_bank?: string
  supplier_bank?: string
  ref_no?:string
  remorks?: string
  amount: number | null
}

export const initial_fuel_advance: FuelAdvType = {
  station_name: '',
  liters: null,
  fuel_rate: null,
  fuel_total: null,
  driver_cash: null,
  total: 0
}
export const initial_advance: AdvType = {
  mode: '',
  amount: null,
  supplier_bank: '',
  remarks: ''
}
export const initialForm: FormProp = {
  driver: "",
  driver_name: "",
  supplier_name: "",
  supplier: "",
  series: "",
  truck_no: "",
  truck: "",
  source: "",
  destination: "",
  supplierPrice: null,
  fuel_advance: [initial_fuel_advance],
  advance: [initial_advance]
}