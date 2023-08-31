from parlo.trip.api.payments.calculate_invoice_balance import calculate_invoice_balance
from parlo.trip.api.payments.calculate_customer_invoice_balance import calculate_customer_invoice_balance
from parlo.trip.api.payments.calculate_indent_balance import calculate_indent_balance
import frappe
from frappe.client import cancel
from frappe.utils.data import get_datetime, now
from parlo.util.constants import *
from parlo.trip.api.payments.calculate_trip_balance import calculate_trip_balance


"""
Author: Nithishwar S
Function: cancel_payment
Input: {
    payment_name: str
}
Usage:
    * With payment_name get Journal Entry and cancel(frappe method) JE then update payment status to 'Cancelled'
    * get total processed payments done for that Trip
    * calculate balance from total_charge_amount - total_payment_amount and update in indent
    * if payment type if fuel then call cancel_trip_fuel else cancel_trip_payment & cancel_indent_payment
"""
@frappe.whitelist()
def cancel_payment(cancel_payment_input):
    
    payment_name = cancel_payment_input.get('payment_name')
    payment = frappe.get_doc('Payment',payment_name)
    payment_type = payment.get('payment_type')
    journal_entry = payment.get('journal_entry')
    
    # To cancel Journal Entry Here we used cancel(frappe method)
    cancel('Journal Entry',journal_entry)
    
    frappe.db.set_value('Payment',payment_name,{
            "deleted_at": now(),
            "deleted_by": frappe.session.user,
            "status": PAYMENT_STATUS['cancelled']
        })    
    
    if payment_type == PAYMENT_TYPE['fuel']:
        cancel_trip_fuel(payment_name)
    else:
        cancel_trip_payment(payment_name)
        cancel_indent_payment(payment_name)        


    return True

"""
Author: Nithishwar S
Function: cancel_indent_payment
Input: payment: str
Usage:
    * With payment_name get Indent payment
    * If Indent payments length > 0 the update status to Cancelled
    * and call calculate_indent_balance to update current balance
"""
def cancel_indent_payment(payment):
    
    indent_payments = frappe.db.get_list('Indent Payment',filters={
        "payment": payment
    },fields=["name","indent"])
    
    print('indent_payments',indent_payments)
    
    if len(indent_payments) > 0:
        for indent_payment in indent_payments:
            frappe.db.set_value('Indent Payment',indent_payment.get('name'),{
                "status": PAYMENT_STATUS['cancelled'],
                "deleted_at": now(),
                "deleted_by": frappe.session.user
            })
            
            calculate_indent_balance(indent_payment.get('indent'))            
            
            
    customer_invoice_payments = frappe.db.get_list('Customer Invoice Payment',filters={
        "payment": payment
    },fields=["name","customer_invoice"])            
    
    print('supplier_payments',customer_invoice_payments)
    
    if len(customer_invoice_payments) > 0:
        for customer_invoice_payment in customer_invoice_payments:
            frappe.db.set_value('Customer Invoice Payment',customer_invoice_payment.get('name'),{
                "status": PAYMENT_STATUS['cancelled'],
                "deleted_at": now(),
                "deleted_by": frappe.session.user
            })
            calculate_customer_invoice_balance(customer_invoice_payment.get('customer_invoice'))       
    
"""
Author: Nithishwar S
Function: cancel_trip_payment
Input: payment: str
Usage:
    * With payment_name get Trip payment
    * If Trip payments length > 0 the update status to Cancelled
    * and call calculate_trip_balance to update current balance    
"""    
def cancel_trip_payment(payment):
    
    trip_payments = frappe.db.get_list('Trip Payment',filters={
        "payment": payment
    },fields=["name","trip"])
    print('trip_payments',trip_payments
          )
    if len(trip_payments) > 0:
        for trip_payment in trip_payments:
            frappe.db.set_value('Trip Payment',trip_payment.get('name'),{
                "status": PAYMENT_STATUS['cancelled'],
                "deleted_at": now(),
                "deleted_by": frappe.session.user
            })
            calculate_trip_balance(trip_payment.get('trip'))            
            
            
    supplier_payments = frappe.db.get_list('Supplier Invoice Payment',filters={
        "payment": payment
    },fields=["name","supplier_invoice"])            
    
    
    print('supplier_payments',supplier_payments)
    if len(supplier_payments) > 0:
        for supplier_payment in supplier_payments:
            frappe.db.set_value('Supplier Invoice Payment',supplier_payment.get('name'),{
                "status": PAYMENT_STATUS['cancelled'],
                "deleted_at": now(),
                "deleted_by": frappe.session.user
            })
            calculate_invoice_balance(supplier_payment.get('supplier_invoice'))     
            
"""
Author: Nithishwar S
Function: cancel_trip_fuel
Input: payment: str
Usage:
    * With payment_name get Trip Fuel
    * If Trip Fuel length > 0 the update status to Cancelled
    * and call calculate_trip_balance to update current balance
"""          
def cancel_trip_fuel(payment):
    trip_fuels = frappe.db.get_list('Trip Fuel',filters={
        "payment": payment
    },fields=["name","trip"])
    
    if len(trip_fuels) > 0:
        for trip_fuel in trip_fuels:
            frappe.db.set_value('Trip Fuel',trip_fuel.get('name'),{
                "status": PAYMENT_STATUS['cancelled']
            })        
            
            calculate_trip_balance(trip_fuel.get('trip'))            
    