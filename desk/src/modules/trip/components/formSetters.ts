interface Field {
    name: any;
    value: any;
  }

  export const setConfirmTripForm = ( value : any ) => {
    const _data: Field[] = [
      {
        name: "source",
        value: value?.source,
      },
      {
        name: "destination",
        value: value?.destination, 
      },
      {
        name: "driver",
        value: value?.driver, 
      },
      {
        name: "supplier",
        value: value?.supplier, 
      },
      {
        name: "supplier_price",
        value: value?.supplier_price, 
      },
      {
        name: "truck_no",
        value: value?.truck_no, 
      }
    ];
    return _data;
  }