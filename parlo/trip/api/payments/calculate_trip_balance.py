import frappe
from frappe.utils.data import now
from parlo.util.constants import *

"""
Author: Nithishwar S
Function: calculate_trip_balance
Input: trip_name: str
Usage:
    * With trip_name get 'Trip Charge' and calculate the sum payable for this Trip
    * get total processed payments done for that Trip
    * calculate balance from total_charge_amount - total_payment_amount and update in indent
"""
@frappe.whitelist()
def calculate_trip_balance(trip_name:str) -> None:

    trip_charges = frappe.db.get_list('Trip Charge',fields=["*"],filters={
        "trip":trip_name
    })
    
    total_charge_amount = sum(map(lambda trip_charge: trip_charge['supplier_amount'] or 0 ,trip_charges))
    
    trip_payments = frappe.db.get_list('Trip Payment',fields=["*"],filters={
        "trip":trip_name,
        "status": PAYMENT_STATUS['processed']
    })   
    
    total_payment_amount = sum(map(lambda trip_payment: trip_payment['amount'] or 0 ,trip_payments))
    
    balance = total_charge_amount - total_payment_amount
    
    frappe.db.set_value('Trip', trip_name, {
        'balance': balance,
        'paid': total_payment_amount,
        "paid_at": now() if balance == 0 else None
    })
 
    return balance
