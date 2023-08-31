from parlo.trip.api.payments.calculate_trip_balance import calculate_trip_balance
from parlo.util.constants import *
from datetime import date
from frappe.utils.data import now
import frappe

"""
Author: Nithishwar S
Function: supplier_payment
Input:  {
                trip_payment_names : [str],
                supplier : str,
                supplier_bank: str,
                company_bank: str,
                ref_no: str,
                date: datetime,
                remarks: str,
                payment_mode: str
            }
Usage:
    * Calculate total request amount,
    * Create a Je for give trip payment request ,
    * Create Payment entry for total amount 
    * Then loop request and update status and Payment , calculate trip balance after payment
"""
@frappe.whitelist()
def supplier_payment(supplier_payment):
    
    trip_payments = validate_supplier_bank_advance(supplier_payment)
    supplier = supplier_payment.get('supplier')
    
    company_bank = supplier_payment.get('company_bank')
    supplier_bank = supplier_payment.get('supplier_bank')
    ref_no = supplier_payment.get('ref_no')
    date = supplier_payment.get('date')
    remarks = supplier_payment.get('remarks')
    payment_mode = supplier_payment.get('payment_mode')
    total_amount = sum(map(lambda trip_payment: trip_payment['amount'], trip_payments))
    
    je_input = {
        'trip_payments':trip_payments,
        'total_amount':total_amount,
        'supplier':supplier,
        'remarks':remarks,
        'ref_no':ref_no,
        'date':date,
        'payment_mode': payment_mode
    }
    
    je = create_je(je_input)
    
    payment_input = {
        "amount":total_amount,
        "supplier": supplier,
        'payment_mode' : payment_mode,
        'payment_type':'advance',
        'journal_entry':je,
        'company_bank': company_bank,
        'supplier_bank': supplier_bank, 
        "remarks":remarks,
        "date":date,
        "ref_no":ref_no,
        "trip_count":len(trip_payments)
        
    }
    
    payment = create_payment(payment_input)
    
    for trip_payment in trip_payments:
        
        frappe.db.set_value('Trip Payment', trip_payment.name, {
            'status': PAYMENT_STATUS['processed'],
            'company_bank': company_bank,
            'supplier_bank': supplier_bank,
            "payment":payment,
            'date':date
        })
        calculate_trip_balance(trip_payment.trip)
    return je

def create_je(je_input):
    
    trip_payments = je_input.get('trip_payments')
    ref_no = je_input.get('ref_no')
    ref_date = je_input.get('date')
    remarks = je_input.get('remarks')
    total_amount = je_input.get('total_amount')
    supplier = je_input.get('supplier')
    payment_mode:str = je_input.get('payment_mode')
    
    trip_payment = trip_payments[0]
    payment_type = trip_payment.get('payment_type')
    
    # get company to construct chart of account
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')
    
    payment_account = f'{CHART_OF_ACCOUNT[payment_mode.lower()]} {company_abbr}'
    creditor_acc = f'{CHART_OF_ACCOUNT.get("creditors")} {company_abbr}'

    je_items = [{
        "idx": 1,
        "account": payment_account,
        "credit_in_account_currency": total_amount,
        "is_advance": 'Yes' if payment_type == 'Advance' else 'No'
    }]

    for index,trip_payment in enumerate(trip_payments):
        
        amount = trip_payment.get('amount')
        
        je_item = {
            "idx": index + 2,
            "account": creditor_acc,
            "party_type": "Supplier",
            "party": supplier,
            "debit_in_account_currency": amount,
            "is_advance": 'Yes',
            "user_remark": trip_payment.get('trip_id')
        }
        
        je_items.append(je_item)
    
    create_je_input = {
        **JE_DEFAULT,
        "posting_date": date.today(),
        "total_debit": total_amount,
        "total_credit": total_amount,
        "accounts": je_items,
        "cheque_no": ref_no  or "-",
        "cheque_date": ref_date,
        "user_remark": remarks
    }   
    
    new_je = frappe.get_doc({
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
            **create_je_input
        })
    
    new_je.insert()
    je_name = new_je.name
    
    return je_name



def create_payment(payment_input):
    payment_mode  = payment_input.get('payment_mode')
    payment_type  = payment_input.get('payment_type')
    amount = payment_input.get('amount')
    supplier = payment_input.get('supplier')
    customer = payment_input.get('customer')
    ref_no = payment_input.get('ref_no')
    journal_entry = payment_input.get('journal_entry')
    date = payment_input.get('date')
    remarks = payment_input.get('remarks')
    trip_count = payment_input.get('trip_count')
    company_bank = payment_input.get('company_bank')
    supplier_bank = payment_input.get('supplier_bank')
    
    new_payment = frappe.get_doc({
            "doctype": "Payment",
            "supplier":supplier,
            "amount":amount,
            'company_bank': company_bank,
            'supplier_bank': supplier_bank,
            "trip_count":trip_count,
            "customer":customer,
            "ref_no":ref_no,
            "journal_entry": journal_entry,
            "date": date if date is not None else now(),
            "payment_type": PAYMENT_TYPE[payment_type.lower()],
            "payment_mode":payment_mode,
            "remarks": remarks,
            "status": PAYMENT_STATUS['processed'],
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
        })
    
    new_payment.insert()
    payment_name = new_payment.name
    
    return payment_name    














# Func: validate_supplier_bank_advance
# Author: Nithishwar
# Usage: check given input value are valid or not

def validate_supplier_bank_advance(supplier_payment):        
    trip_payment_names = supplier_payment.get('trip_payment_names')
    supplier = supplier_payment.get('supplier')
    supplier_bank = supplier_payment.get('supplier_bank')
    payment_mode:str = supplier_payment.get('payment_mode')
    ref_no = supplier_payment.get('ref_no')
    date = supplier_payment.get('date')    
    
    # Check payment requeste is there are not
    if len(trip_payment_names) == 0:
        frappe.throw('Minimum one trip is required')
    
    # Check supplier is there or not
    if supplier is None:
        frappe.throw('Supplier is required')
    
    # Check supplier bank if it is bank transaction is there or not    
    if payment_mode.lower() == 'bank' and supplier_bank is None:
        frappe.throw('Supplier bank account is required')
    
    # Check supplier is there or not    
    if payment_mode.lower() == 'bank' and ( ref_no is None or date is None ):
        frappe.throw('Referene and Date is required')
        
        
    trip_payments_other_supplier = frappe.db.get_list('Trip Payment', filters={
        'name': ['in', trip_payment_names],
        'supplier': ['!=',supplier]
    })
    
    if len(trip_payments_other_supplier) > 0:
        frappe.throw('Supplier should same for payment')

    trip_payments = frappe.db.get_list('Trip Payment', filters={
        'name': ['in', trip_payment_names]
    },fields=["*"])        
    
    unique_payment_type_list = list(set(trip_payment.payment_type for trip_payment in trip_payments))       
    
    unique_payment_mode_list = list(set(trip_payment.payment_mode for trip_payment in trip_payments))       
    
    if len(unique_payment_type_list) > 1:
        frappe.throw('Advance / Balance any one only allowed')
        
    if len(unique_payment_mode_list) > 1:
        frappe.throw('Payment modes cannot be mix up')
    
    processed_list = list(filter( lambda trip_payment: trip_payment.status == 'Processed' ,trip_payments))       
    cancelled_list = list(filter( lambda trip_payment: trip_payment.status == 'Cancelled' ,trip_payments))       
    
        
    if len(processed_list) > 1:
        frappe.throw(f'{len(processed_list)} trips payment already processed')
        
    if len(cancelled_list) > 1:
        frappe.throw(f'{len(cancelled_list)} trip payments are cancelled ')
        
        
    return trip_payments