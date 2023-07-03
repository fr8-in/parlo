from datetime import date
from parlo.trip.api.payments.calculate_indent_balance import calculate_indent_balance
from frappe.utils.data import now
from parlo.util.constants import *
import frappe

"""
Author: Nithishwar S
Function: book_customer_request
Input: {
            "customer" : str,
            "indent_payment_names": [str],
            "payment_mode": str,
            "remarks": str,
            "date": datetime,
            "ref_no": str,
            "company_bank": str,
        }
Usage: Process given payment requests by creation JE and payment entry then update status to processed and payment in indent_payment(request)
"""

@frappe.whitelist()
def book_customer_request(book_customer_request_input):
    indent_payments = validate_customer_request(book_customer_request_input)
    customer = book_customer_request_input.get('customer')
    company_bank = book_customer_request_input.get('company_bank')
    ref_no = book_customer_request_input.get('ref_no')
    date = book_customer_request_input.get('date')
    remarks = book_customer_request_input.get('remarks')
    payment_mode = book_customer_request_input.get('payment_mode')
    total_amount = sum(map(lambda indent_payment: indent_payment['amount'], indent_payments))
    
    je_input = {
        'indent_payments':indent_payments,
        'total_amount':total_amount,
        'customer':customer,
        'remarks':remarks,
        'ref_no':ref_no,
        'date':date,
        'payment_mode': payment_mode
    }    
    
    je = create_je(je_input)
    
    payment_input = {
        "amount":total_amount,
        "customer": customer,
        'payment_mode' : payment_mode,
        'payment_type':'advance',
        'journal_entry':je,
        'company_bank': company_bank,
        "remarks":remarks,
        "date":date,
        "ref_no":ref_no,
        "indent_count":len(indent_payments)
    }
    
    payment = create_payment(payment_input)    
    for indent_payment in indent_payments:
        
        frappe.db.set_value('Indent Payment', indent_payment.name, {
            'status': PAYMENT_STATUS['processed'],
            'company_bank': company_bank,
            "payment":payment,
            'date':date
        })
        calculate_indent_balance(indent_payment.indent)
        
    return je    
    

"""
Author: Nithishwar S
Function: create_payment
Input: {
        "amount":float,
        "customer": str,
        'payment_mode' : str,
        'payment_type':str,
        'journal_entry':str,
        'company_bank': str,
        "remarks":str,
        "date":datetime,
        "ref_no":str,
        "indent_count":int
    }
Usage: Create a entry in payment table 
"""
def create_payment(payment_input):
    payment_mode  = payment_input.get('payment_mode')
    payment_type  = payment_input.get('payment_type')
    amount = payment_input.get('amount')
    customer = payment_input.get('customer')
    ref_no = payment_input.get('ref_no')
    journal_entry = payment_input.get('journal_entry')
    date = payment_input.get('date')
    remarks = payment_input.get('remarks')
    indent_count = payment_input.get('indent_count')
    company_bank = payment_input.get('company_bank')
    
    new_payment = frappe.get_doc({
            "doctype": "Payment",
            "customer":customer,
            "amount":amount,
            'company_bank': company_bank,
            "indent_count":indent_count,
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
    print('payment_name,',payment_name)
    
    return payment_name    
   

"""
Author: Nithishwar S
Function: create_je
Input: {
        'indent_payments':[indent_payment],
        'total_amount':float,
        'customer':str,
        'remarks':str,
        'ref_no':str,
        'date':datetime,
        'payment_mode': str
    }   
Usage: Create a Journal entry against customer with respective credit acc (cash / bank)
"""    
def create_je(je_input):
    indent_payments = je_input.get('indent_payments')
    
    ref_date = je_input.get('date')
    customer = je_input.get('customer')
    ref_no = je_input.get('ref_no')
    remarks = je_input.get('remarks')
    total_amount = je_input.get('total_amount')
    payment_mode:str = je_input.get('payment_mode')
    
    indent_payment = indent_payments[0]
    payment_type = indent_payment.get('payment_type')
    
    # get company to construct chart of account
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')
    debtor_acc = f'{CHART_OF_ACCOUNT["debtors"]} {company_abbr}'
    payment_account = f'{CHART_OF_ACCOUNT[payment_mode.lower()]} {company_abbr}'

    je_items = [{
        "idx": 1,
        "account": payment_account,
        "debit_in_account_currency": total_amount,
        "is_advance": 'Yes'
    }]

    for index,indent_payment in enumerate(indent_payments):
        
        print('index',index)
        amount = indent_payment.get('amount')
        
        je_item = {
            "idx": index + 1,
            "account": debtor_acc,
            "party_type": "Customer",
            "party": customer,
            "credit_in_account_currency": amount,
            "is_advance": 'Yes',
            "user_remark": indent_payment.get('indent_id')
        }
        
        je_items.append(je_item)
    
    create_je_input = {
        **JE_DEFAULT,
        "posting_date": date.today(),
        "total_debit": total_amount,
        "total_credit": total_amount,
        "accounts": je_items,
        "cheque_no": ref_no or "-",
        "cheque_date": ref_date,
        "user_remark": remarks
    }   
        
    print('create_je_input',create_je_input)
    
    new_je = frappe.get_doc({
            "creation": now(),
            "owner": frappe.session.user,
            **create_je_input
        })
    
    new_je.insert()
    je_name = new_je.name
    
    print('je_name',je_name)
    return je_name    
    
    
"""
Author: Nithishwar S
Function: validate_customer_request
Input: {
        "customer" : str,
        "indent_payment_names": [str],
        "payment_mode": str,
        "remarks": str,
        "date": datetime,
        "ref_no": str,
        "company_bank": str,
    }
Usage:Validate given request in eligible to process if not throw error
"""      
def validate_customer_request(book_customer_request_input):
    print({"book_customer_request_input":book_customer_request_input})
    indent_payment_names = book_customer_request_input.get('indent_payment_names')
    customer = book_customer_request_input.get('customer')
    date = book_customer_request_input.get('date')
    payment_mode = book_customer_request_input.get('payment_mode')
    company_bank = book_customer_request_input.get('company_bank')
    
    # Check payment requested is there are not
    if indent_payment_names is None or len(indent_payment_names) == 0:
        frappe.throw('Minimum one indent is required')
    
    # Check supplier is there or not
    if customer is None:
        frappe.throw('Customer is required')
    
    # Check supplier bank if it is bank transaction is there or not    
    if payment_mode.lower() == 'bank' and company_bank is None:
        frappe.throw('Company bank account is required')
    
    indent_payments_other_customer = frappe.db.get_list('Indent Payment', filters={
        'name': ['in', indent_payment_names],
        'customer': ['!=',customer]
    })
    
    if len(indent_payments_other_customer) > 0:
        frappe.throw('Customer should same for payment')
        
        
    print('indent_payment_names',indent_payment_names)
    indent_payments = frappe.db.get_list('Indent Payment', filters={
        'name': ['in', indent_payment_names]
    },fields=["*"])        
    
    print('indent_payments',indent_payments)
    unique_payment_type_list = list(set(indent_payment.payment_type for indent_payment in indent_payments))       
    unique_payment_mode_list = list(set(indent_payment.payment_mode for indent_payment in indent_payments))       
    
    if len(unique_payment_type_list) > 1:
        frappe.throw('Advance / On delivery any one only allowed')
        
    if len(unique_payment_mode_list) > 1:
        frappe.throw('Payment modes cannot be mix up')
        
    processed_list = list(filter( lambda indent_payment: indent_payment.status == 'Processed' ,indent_payments))       
    cancelled_list = list(filter( lambda indent_payment: indent_payment.status == 'Cancelled' ,indent_payments))       
    
        
    if len(processed_list) > 1:
        frappe.throw(f'{len(processed_list)} indents payment already processed')
        
    if len(cancelled_list) > 1:
        frappe.throw(f'{len(cancelled_list)} indents requests are cancelled ')
            
    return indent_payments