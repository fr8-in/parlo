from parlo.trip.api.payments.create_indent_advance_req import create_indent_advance_req
from parlo.util.constants import *
from parlo.trip.api.payments.supplier_fuel_request import supplier_fuel_request
from parlo.trip.api.payments.supplier_advance import supplier_advance
import frappe
from frappe.utils.data import now

# Author: Nithishwar S
# Function: Confirm_trip
# usage: Create new trip with given source,destination,driver,truck,supplier 
# validating given truck and driver not in active trip
# then insert trip and update that trip name in given indents

@frappe.whitelist()
def confirm_trip(confirmTripInput):
        print('confirmTripInput',confirmTripInput)
        truck_no = confirmTripInput.get('truck')
        driver = confirmTripInput.get('driver')
        source = confirmTripInput.get('source')
        supplier = confirmTripInput.get('supplier')
        destination = confirmTripInput.get('destination')
        indent_names = confirmTripInput.get('indents')
        supplier_price = confirmTripInput.get('supplier_price')
        customer_price = confirmTripInput.get('customer_price')
        advance = confirmTripInput.get('advance')
        fuel_advance  = confirmTripInput.get('fuel_advance')
        tripName = confirmTripInput.get('tripName')
        
        indents = frappe.db.get_list('Indent',fields=["*"],filters={"name":["in",indent_names] })
        
        cases = sum(map(lambda indent:indent['cases']  ,indents))
        weight = sum(map(lambda indent:indent['weight']  ,indents))
        print('truck_no', advance)
        validate_truck(truck_no)
        validate_driver(driver)
        
        if tripName is None:
            new_trip = frappe.get_doc({
            "doctype": "Trip",
            "source": source,
            "destination": destination,
            "truck": truck_no,
            "weight":weight,
            "cases":cases,
            "indent_count":len(indent_names) if indent_names is not None else 0,
            "driver": driver,
            "supplier": supplier,
            "supplier_price": supplier_price,
            "customer_price": customer_price,
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user
            })
            new_trip.insert()
            trip_name = new_trip.name
            
            new_trip_charge = frappe.get_doc({
            "doctype": "Trip Charge",
            "trip": trip_name,
            "charge_type":"Price",
            "supplier_amount": supplier_price,
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user
            })
            new_trip_charge.insert()
        else:
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
            document.confirmed_at = now()
            document.save()
            trip_name = tripName

        if indent_names:
            update_indent_trip(indent_names, trip_name)
            
        if advance is not None and len(advance) > 0 and supplier is not None :
            
            supplier_advance_input = {
                'advances':advance,
                'trip_name':trip_name
            }
            
            supplier_advance(supplier_advance_input)
        
        
        if fuel_advance is not None and len(fuel_advance) > 0 :
            supplier_fuel_request_input = { 
                "fuel_request":fuel_advance,
                "trip_name":trip_name
                }        
            
            supplier_fuel_request(supplier_fuel_request_input)


        return trip_name


# ----------------------------------
def update_indent_trip(indent_names,trip):
    
    values = {"trip": trip,"confirmed_at": now(),"workflow_state":"Confirmed"}
    
    for indent_name in indent_names:
        frappe.db.set_value("Indent", indent_name, values)
        create_indent_advance_req(indent_name)

# ----------------------------------
def validate_truck(truck_no):
    if not truck_no:
        frappe.throw('Truck number is mandatory.')
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
        

def validate_driver(driver):
    if not driver:
        frappe.throw('Driver number is mandatory.')
    trips = frappe.get_list('Trip',filters={
                'driver':driver,
                'workflow_state': 'Confirmed'
                },
            fields=['name'])
    
    if not trips:
        pass
    else:
        frappe.throw('Driver in active trip')        
