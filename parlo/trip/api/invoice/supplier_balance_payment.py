from datetime import date
import frappe
from parlo.util.constants import *
from frappe.utils.data import now

@frappe.whitelist()
def supplier_balance_payment(balance_payment_input):
    
    invoices = balance_payment_input.get('invoices')
    mode = balance_payment_input.get('payment_mode')
    payment_mode:str = PAYMENT_MODE[mode.lower()]
    supplier_bank = balance_payment_input.get('supplier_bank')
    company_bank = balance_payment_input.get('company_bank')
    ref_no = balance_payment_input.get('ref_no')
    date = balance_payment_input.get('date')
    remarks = balance_payment_input.get('remarks')
    
    supplier_invoice_payments= []
    trip_payments = []

    for invoice in invoices:
        
        invoice_trips = validate_and_map_trip_invoice(invoice)
        supplier_invoice_payments.extend(invoice_trips.get('supplier_invoice_payment'))
        trip_payments.extend(invoice_trips.get('trip_payments'))
        
    payment_amount = sum(map(lambda supplier_invoice_payment:supplier_invoice_payment['amount'],supplier_invoice_payments))             
    
    supplier = supplier_invoice_payments[0]['supplier']
    
    balance_je_input = {
        "amount":payment_amount,
        "supplier":supplier,
        "payment_mode":payment_mode,
        "trip_payments":trip_payments
    }
    
    balance_je = create_balance_je(balance_je_input)   
            
    payment_input = {
        "journal_entry":balance_je,
        "amount":payment_amount,
        "supplier":supplier,
        "payment_mode":payment_mode,
        "supplier_bank":supplier_bank,
        "company_bank":company_bank,
        "ref_no":ref_no,
        "date":date,
        "remarks":remarks,
        "trip_count":len(trip_payments)
    }

    payment = create_payment(payment_input)
    
    supplier_invoice_payments = list(map(lambda invoice_payment: {**invoice_payment,"payment":payment},supplier_invoice_payments))
    trip_payments = list(map(lambda trip_payment: {
        **trip_payment,"payment":payment,
        "payment_mode":payment_mode,
        "supplier_bank":supplier_bank,
        "company_bank":company_bank,
        "ref_no":ref_no,
        "date":date,
        "remarks":remarks
    },trip_payments))
    
    create_trip_payment({"trip_payments":trip_payments})
    create_supplier_invoice_payment({"supplier_invoice_payments":supplier_invoice_payments})
    
    return {"payment":payment}


def create_payment(payment_input):
    payment_mode  = payment_input.get('payment_mode')
    amount = payment_input.get('amount')
    supplier = payment_input.get('supplier')
    journal_entry = payment_input.get('journal_entry')
    date = payment_input.get('date')
    remarks = payment_input.get('remarks')
    supplier_bank = payment_input.get('supplier_bank')
    company_bank = payment_input.get('company_bank')
    ref_no = payment_input.get('ref_no')
    trip_count = payment_input.get('trip_count')
    
    new_payment = frappe.get_doc({
            "doctype": "Payment",
            "supplier":supplier,
            "amount":amount,
            "trip_count":trip_count,
            "supplier_bank":supplier_bank,
            "journal_entry": journal_entry,
            "company_bank":company_bank,
            "ref_no":ref_no,
            "date": date if date is not None else now(),
            "payment_type": PAYMENT_TYPE['balance'],
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


def create_supplier_invoice_payment(supplier_invoice_payment_input):
    supplier_invoice_payments = supplier_invoice_payment_input.get('supplier_invoice_payments')
    
    for supplier_invoice_payment in supplier_invoice_payments:
        new_supplier_invoice_payment = frappe.get_doc({
           **supplier_invoice_payment
        })
    
    new_supplier_invoice_payment.insert()
    supplier_invoice_payment_name = new_supplier_invoice_payment.name
    print('supplier_invoice_payment_name,',supplier_invoice_payment_name)        
        
def create_trip_payment(trip_payment_input):
    trip_payments = trip_payment_input.get('trip_payments')
    
    for trip_payment in trip_payments:
        print('trip_payment',trip_payment)
        new_trip_payment = frappe.get_doc({
           **trip_payment
        })
    
        new_trip_payment.insert()
        trip_payment_name = new_trip_payment.name
        print('trip_payment_name,',trip_payment_name)        
        
    
def validate_and_map_trip_invoice(invoice):
    invoice_name = invoice.get('invoice_name')
    invoice_detail = frappe.get_doc('Supplier Invoice',invoice_name)
    supplier = invoice_detail.get('supplier')
    trips = invoice.get('trips')
    trips_amount = sum(map(lambda trip:trip.get('amount'),trips))
    invoice_balance = invoice_detail.get('balance')
    trip_payments= []
    
    if(supplier is None ):
        frappe.throw('Supplier Required')
        
    if(trips_amount > invoice_balance):
        frappe.throw(f'Invoice {invoice_detail.name} payment amount {trips_amount} exceeds invoice balance {invoice_balance}')
    
    supplier_invoice_payment = [{
        "doctype": "Supplier Invoice Payment",
        "supplier_invoice":invoice_name,
        "supplier":supplier,
        "amount": trips_amount,
        "creation": now(),
        "owner": frappe.session.user,
    }]    
    
    for trip in trips:
        
        trip_payment = {
            "doctype": "Trip Payment",
            "supplier_invoice" : invoice_name,
            "supplier": supplier,
            "amount": trip.get('amount'),
            "date": now(),
            "trip":trip.get('name'),
            "trip_id":trip.get('id'),
            "status": PAYMENT_STATUS['processed'],
            "payment_type": PAYMENT_TYPE['balance'],
            "creation": now(),
            "owner": frappe.session.user,
        }
        
        trip_payments.append(trip_payment)  
    
    print({"trip_payments":trip_payments,"supplier_invoice_payment":supplier_invoice_payment})                  
    return {"trip_payments":trip_payments,"supplier_invoice_payment":supplier_invoice_payment}





# -----------------------------------
# Author: Nithishwar
# Func: create_je
# Usage: used to create journal entry for supplier advance payment

def create_balance_je(supplier_payment_je):
    
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')
    payment_mode = supplier_payment_je.get('payment_mode')
    amount = supplier_payment_je.get("amount")
    trip_payments = supplier_payment_je.get("trip_payments")
    payment_account = f'{CHART_OF_ACCOUNT[payment_mode.lower()]} {company_abbr}'
    creditor_acc = f'{CHART_OF_ACCOUNT.get("creditors")} {company_abbr}'

    supplier = supplier_payment_je.get("supplier")
    remarks = supplier_payment_je.get("remarks")
    
    je_items = [{
        "idx": 1,
        "account": payment_account,
        "credit_in_account_currency": amount,
    }]
    
    for index,trip_payment in enumerate(trip_payments):
        
        trip_je_item = {
            "idx": index + 2,
            "account": creditor_acc,
            "party_type": "Supplier",
            "party": supplier,
            "debit_in_account_currency": amount,
            "user_remark": trip_payment.get('trip_id')
        }
        
        je_items.append(trip_je_item)
    
    
    print('je_items',je_items)
    create_je_input = {
        **JE_DEFAULT,
        "posting_date": date.today(),
        "total_debit": amount,
        "user_remark":remarks,
        "total_credit": amount,
        "accounts": je_items
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
