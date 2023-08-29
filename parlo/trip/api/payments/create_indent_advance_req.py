from parlo.util.constants import *
import frappe
from frappe.utils.data import now


"""
Author: Nithishwar S
Function: create_indent_advance_req
Input: {
    indent_name: str,
    advance: float,
    on_delivery: float
}
Usage:
    * if advance > 0  then create a Indent Payment request entry for that given indent_name
    * if on_delivery > 0  then create a Indent Payment request entry for that given indent_name
"""

def create_indent_advance_req(indent_name):
    indent = frappe.get_doc('Indent',indent_name)       
    advance_amount = indent.get('advance')
    on_delivery_amount = indent.get('on_delivery')
    
    if advance_amount is not None and advance_amount > 0:
        new_indent_payment = frappe.get_doc({
            "doctype": "Indent Payment",
            "customer":indent.get('customer'),
            "amount":advance_amount,
            "indent_id": indent.get('id'),
            "indent":indent_name,
            "date": now(),
            "payment_type": PAYMENT_TYPE['advance'],
            "status": PAYMENT_STATUS['requested'] ,
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
        })
        
        new_indent_payment.insert()
        
    
    if on_delivery_amount is not None and on_delivery_amount > 0:
        new_indent_payment = frappe.get_doc({
            "doctype": "Indent Payment",
            "customer":indent.get('customer'),
            "amount":on_delivery_amount,
            "indent":indent_name,
            "date": now(),
            "indent_id": indent.get('id'),
            "payment_type": PAYMENT_TYPE['on_delivery'],
            "status": PAYMENT_STATUS['requested'] ,
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
        })
        
        new_indent_payment.insert()