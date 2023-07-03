interface Field {
    name: any;
    value: any;
  }

  export const setIndentFormValues = (value:any) =>{
    const _data:Field[] =[
        {
            name : "series" , value: value?.series
        },
        {
            name : "customer" , value : value?.customer
        },
        {
            name: "from" , value : value?.from
        },
        {
            name: "delivery" , value : value?.to
        },
        {
            name: "on_delivery" , value : value?.on_delivery
        },
        {  
            name:"rate_type", value:value?.rate_type
        },
        {  
            name:"rate_type_name", value:value?.rate_type?.name
        },
        {  
            name:"billable", value:value?.billable
        },
        {  
            name:"advance", value:value?.advance
        },
        {
            name:"consignee", value:value?.consignee
        },
        {
            name:"rate_type" , value:value?.rate_type
        }
    ]
    return _data
  }

export const setIndentSeries = (value: any) => {
  const _data: Field[] = [
    //Series
    {
      name: "series",
      value: value?.series_name,
    },
    //Lane
    {
      name: "from",
      value: value?.from || null, 
    },
    {
      name: "delivery",
      value: value?.to || null ,
    },
    //Price Master
    {
      name: "customer",
      value: value?.customer || null,
    },
    {
      name: "rate_type_name",
      value: value?.rate_type || null,
    },
    {
      name: "unit_price",
      value: value?.unit_price || null,
    },
    {
      name: "consignee",
      value: value?.consignee || null,
    },
  ];
  return _data;
}; 


export const setCalculatablesToInitial = ( value : any ) => {
  const _data: Field[] = [
    {
      name: "customer_price",
      value: value?.customer_price || null
    },
    {
      name: "weight",
      value: value?.weight || null
    },
    {
      name: "cases",
      value: value?.cases || null
    },
    {
      name:"advance",
      value: value?.advance || null
    },
    {
      name:"on_delivery",
      value:value?.on_delivery || null
    },
    {
      name:"billable",
      value:value?.billable || null
    }
  ];
  return _data;
}

export const setAdvanceDeilveryToNull = () => {
  const _data: Field[] = [
    {
      name: "advance",
      value: null,
    },
    {
      name: "on_delivery",
      value: null, 
    }
  ];
  return _data;
}