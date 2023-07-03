from parlo.trip.api.payments.supplier_payment import supplier_payment
from frappe.utils.data import now
from parlo.util.constants import *
import frappe


"""
Author: Nithishwar S
Function: supplier_direct_payment
Input:  {
                trips : [{
                    name: str,
                    id:str,
                    amount: str
                }],
                supplier : str,
                supplier_bank: str,
                company_bank: str,
                ref_no: str,
                date: datetime,
                remarks: str,
                payment_mode: str,
                payment_type: str
            }
        }
Usage:
    * Loop given trips and create Trip Payment and store in a array
    * Then call supplier_payment to process and create JE & payment Entry
"""
@frappe.whitelist()
def supplier_direct_payment(supplier_direct_payment):
    
    supplier = supplier_direct_payment.get('supplier')
    company_bank = supplier_direct_payment.get('company_bank')
    supplier_bank = supplier_direct_payment.get('supplier_bank')
    ref_no = supplier_direct_payment.get('ref_no')
    date = supplier_direct_payment.get('date')
    remarks = supplier_direct_payment.get('remarks')
    payment_mode = supplier_direct_payment.get('payment_mode')    
    trips = supplier_direct_payment.get('trips')
    payment_type = supplier_direct_payment.get('payment_type')    
    trip_payment_names = []
    
    for trip in trips:
        
        new_trip_payment = frappe.get_doc({
            "doctype": "Trip Payment",
            "supplier":supplier,
            "amount":trip.get('amount'),
            "trip":trip.get('name'),
            "trip_id":trip.get('id'),
            "payment_type": PAYMENT_TYPE[payment_type.lower()],
            "payment_mode":PAYMENT_MODE[payment_mode.lower()],
            "status": PAYMENT_STATUS['requested'],
            "creation": now(),
            "owner": frappe.session.user,
        })
       
        new_trip_payment.insert()
        trip_payment_names.append(new_trip_payment.name)
        
    supplier_payment_input = {
        "trip_payment_names":trip_payment_names,
        "company_bank": company_bank,
        "supplier_bank": supplier_bank,
        "payment_mode": payment_mode,
        "ref_no" :ref_no,
        "date" :date,
        "remarks" :remarks,
        "supplier": supplier
    }        
    
    je = supplier_payment(supplier_payment_input)  
    
    return  je
    
    
    
    