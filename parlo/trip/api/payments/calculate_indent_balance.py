import frappe
from frappe.utils.data import now
from parlo.util.constants import *

"""
Author: Nithishwar S
Function: calculate_indent_balance
Input: indent_name: str
Usage:
    * With indent_name get 'Indent Charge' and calculate the sum receivable for this indent
    * get total processed payments done for that indent
    * get total write_off payments done for that indent
    * calculate balance from total_charge_amount - (total_payment_amount + write_off_amount) and update in indent
"""

@frappe.whitelist()
def calculate_indent_balance(indent_name:str) -> None:
    
    indent_charges = frappe.db.get_list('Indent Charge List',fields=["*"],filters={
        "indent":indent_name
    })
    
    total_charge_amount = sum(map(lambda indent_charge: indent_charge['amount'] or 0 ,indent_charges))
    
    indent_payments = frappe.db.get_list('Indent Payment',fields=["*"],filters={
        "indent":indent_name,
        "status": PAYMENT_STATUS['processed'],
        "payment_type": ["!=",PAYMENT_TYPE['write_off']]
    }) 
    
    write_offs = frappe.db.get_list('Indent Payment',fields=["*"],filters={
        "indent":indent_name,
        "status": PAYMENT_STATUS['processed'],
        "payment_type": PAYMENT_TYPE['write_off']
    })        
    
    total_payment_amount = sum(map(lambda indent_payment: indent_payment['amount'] or 0 ,indent_payments))
    write_off_amount = sum(map(lambda write_off: write_off['amount'] or 0 ,write_offs))
    
    balance = total_charge_amount - (total_payment_amount + write_off_amount)
    
    frappe.db.set_value('Indent', indent_name, {
        'balance': balance,
        'received': total_payment_amount,
        'write_off': write_off_amount,
        "received_at": now() if balance == 0 else None
    })
    
    return balance
