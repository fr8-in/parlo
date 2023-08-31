import frappe
from frappe.utils.data import now

# Author : M.Prasanth
# Function assignTrip
# Usage : Trips can be assigned first and then can be confirmed.Here no payment entries will be created.Only upon confirming the trip payment entries are created.

@frappe.whitelist()
def assignTrip(assignTripInput):
    # try:
        print('Assign trip Inputs -> ', assignTripInput)
        truck_no = assignTripInput.get('truck')
        driver = assignTripInput.get('driver')
        source = assignTripInput.get('source')
        supplier = assignTripInput.get('supplier')
        destination = assignTripInput.get('destination')
        indent_names = assignTripInput.get('indents')
        supplier_price = assignTripInput.get('supplier_price')
        customer_price = assignTripInput.get('customer_price')
        isTripUpdate = assignTripInput.get('isTripUpdate')
        tripName = assignTripInput.get('tripName')

        indents = frappe.db.get_list('Indent', fields=["*"], filters={"name": ["in", indent_names]})
        cases = sum(map(lambda indent:indent['cases']  ,indents))
        weight = sum(map(lambda indent:indent['weight']  ,indents))

        if truck_no:
            validate_truck(truck_no)
        if driver:
            validate_driver(driver)

        if (isTripUpdate and tripName):
            document = frappe.get_doc('Trip', tripName)
            document.source = source
            document.destination = destination
            document.truck = truck_no
            document.weight = weight
            document.cases = cases
            document.indent_count = len(indent_names) if indent_names is not None else 0
            document.driver = driver
            document.supplier = supplier
            document.supplier_price = supplier_price
            document.customer_price = customer_price
            document.updated_at = now()
            document.save()
            if indent_names:
                update_indent_trip(indent_names, tripName)
            return tripName
        else:
            new_trip = frappe.get_doc({
                "doctype": "Trip",
                "source": source,
                "destination": destination,
                "truck": truck_no,
                "weight": weight,
                "cases": cases,
                "indent_count": len(indent_names) if indent_names is not None else 0,
                "driver": driver,
                "supplier": supplier,
                "supplier_price": supplier_price,
                "customer_price": customer_price,
                "creation": now(),
                "assigned_at": now(),
                "owner": frappe.session.user
                })
            new_trip.insert()
            print("NEW TRIP OUTPUT ---> ",new_trip)
            trip_name = new_trip.name
            new_trip_charge = frappe.get_doc({
                "doctype": "Trip Charge",
                "trip": trip_name,
                "charge_type": "Price",
                "supplier_amount": supplier_price,
                "creation": now(),
                "assigned_at": now(),
                "owner": frappe.session.user
                })
            new_trip_charge.insert()
            if indent_names:
                update_indent_trip(indent_names, trip_name)
        return new_trip.name

    # except Exception as e:
    #     frappe.throw("Failed to assign trip!")
    #     frappe.log_error(frappe.get_traceback(), f"Failed to assign trip: {e}")
    #     frappe.msgprint("Failed to assign trip. Please check the logs for more details.")

#-------------------------------------------#
def validate_truck(truck_no):
    trips = frappe.get_list('Trip',filters={
                'truck':truck_no,
                'workflow_state': 'Confirmed',
                'deleted_at': ['=',None]
                },
            fields=['name','id'])
    
    print('trips',trips)
    if not trips:
        pass
    else:
        frappe.throw('Truck in active trip')
        
#-------------------------------------------#
def validate_driver(driver):
    trips = frappe.get_list('Trip',filters={
                'driver':driver,
                'workflow_state': 'Confirmed'
                },
            fields=['name'])
    
    if not trips:
        pass
    else:
        frappe.throw('Driver in active trip')  
        
#--------------------------------------------#
def update_indent_trip(indent_names,trip):
    
    values = {"trip": trip,"assigned_at": now(),"workflow_state":"Assigned"}
    
    for indent_name in indent_names:
        frappe.db.set_value("Indent", indent_name, values)