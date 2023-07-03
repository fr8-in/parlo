from parlo.util.constants import *
import frappe
from parlo.trip.api.payments.supplier_advance import supplier_advance
from parlo.trip.api.payments.supplier_fuel_request import supplier_fuel_request


"""
Author: Nithishwar S
Function: supplier_additional_advance
Input:  {
           trip_name: str,
           fuel_advance: [fuel_advance],
           advance: [advance],
           supplier: str
        }
Usage:
    * Check advance amount and supplier is there then call supplier_advance to create advance request
    * Check fuel_advance amount then call supplier_fuel_request to create fuel advance request
"""
@frappe.whitelist()
def supplier_additional_advance(additional_advance_input):

    trip_name = additional_advance_input.get('trip_name')
    fuel_advance = additional_advance_input.get('fuel_advance')
    advance = additional_advance_input.get('advance')
    supplier = additional_advance_input.get('supplier')

    if advance is not None and len(advance) > 0 and supplier is not None :
        
        supplier_advance_input = {
            'advances':advance,
            'trip_name':trip_name
        }
        
        print('supplier_advance_input',supplier_advance_input)
        
        supplier_advance(supplier_advance_input)
    
    
    if fuel_advance is not None and len(fuel_advance) > 0 :
        supplier_fuel_request_input = { 
            "fuel_request":fuel_advance,
            "trip_name":trip_name
            }        
        
        supplier_fuel_request(supplier_fuel_request_input)
    
    return  True
    
    