import frappe
from frappe.utils.data import now

"""
Author: Nithishwar S
Function: supplier_fuel_request
Input:  {
                fuel_request : [{
                    station_name: str,
                    liters:str,
                    fuel_rate: str,
                    fuel_total: float,
                    driver_cash: float,
                    total: float
                }],
                trip_name : str
            }
        }
Usage:
    * Loop given fuel_request and create Trip Fuel entry
"""
@frappe.whitelist()
def supplier_fuel_request(supplier_fuel_request_input):
    
    fuel_requests = supplier_fuel_request_input.get('fuel_request')
    trip_name = supplier_fuel_request_input.get('trip_name')
    # get Trip details 
    trip = frappe.get_doc('Trip',trip_name)
    trip_id = trip.get('id')
    supplier = trip.get('supplier')
    
    for fuel_request in fuel_requests:
        
        station_name = fuel_request.get('station_name')
        liters = fuel_request.get('liters')
        fuel_rate = fuel_request.get('fuel_rate')
        fuel_total = fuel_request.get('fuel_total')
        driver_cash = fuel_request.get('driver_cash')
        total = fuel_request.get('total')
        
        new_trip_fuel = frappe.get_doc({
            "doctype": "Trip Fuel",
            "fuel_station":station_name,
            "amount":total,
            "trip":trip_name,
            "date": now(),
            "trip_id":trip_id,
            "fuel_lts": liters,
            "fuel_rate":fuel_rate,
            "supplier":supplier,
            "cash": driver_cash,
            "fuel_amount":fuel_total,
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
        })
    
    new_trip_fuel.insert()


        