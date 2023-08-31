/**
 * Truck module related constatnts
 */
const trip = {
  TRIP_STATUS: {
    CONFIRMED: "Confirmed",
    DELIVERED: "Delivered"
  },
  INVOICE_STATUS:  [
    { value: 'Open', label: 'Open' },
    { value: 'Closed', label: 'Closed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ],
  FUEL_REQUEST_STATUS_FILTER:[
    { value:"Requested", label:"Requested" },
    { value:"Filled",label:"Filled" },
    { value:"Approved",label:"Approved" },
    { value:"Cancelled",label:"Cancelled" },
  ],
  FUEL_REQUEST_STATUS_FILLED:"Filled",
  STATUS_CANCELLED:"Cancelled",
  STATUS_APPROVED:"Approved",
  INDENT_PAYMENT_REQUEST_TYPE:[
    {value :"Advance" , label:"Advance"},
    {value :"On Delivery" , label:"On Delivery"}
  ]
}

export default trip
