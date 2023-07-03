from typing import Dict,List
from parlo.util.constants import *
from frappe.utils.data import now
from datetime import date
import frappe

"""
Author: Nithishwar S
Function: supplier_advance
Input:  {
            'advances':[advance],
            'trip_name':trip_name
        }
Usage:
    * With frappe getDoc Trip details
    * Loop given advances
    * if payment_mode is CPS or Cash then process payment
    * Based on the payment_mode create journal entry
"""
def supplier_advance(supplier_advance_input):

    advances = supplier_advance_input.get('advances')
    trip_name = supplier_advance_input.get('trip_name')
    # get company to construct chart of account
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')
    
    # get Trip details 
    trip = frappe.get_doc('Trip',trip_name)
    trip_id = trip.get('id')    
    
    for advance in advances:
        
        mode:str = advance.get('mode')
        payment_mode:str = PAYMENT_MODE[mode.lower()]
        amount:float = advance.get('amount')
        date = advance.get('date')
        remarks = advance.get('remarks')
        supplier_bank  = advance.get('supplier_bank')

        supplier = trip.get('supplier')
        
        creditor_acc = f'{CHART_OF_ACCOUNT.get("creditors")} {company_abbr}'
        debtor_acc = f'{CHART_OF_ACCOUNT.get("debtors")} {company_abbr}'

        trip_payment_input = {
                "supplier":supplier,
                "trip_name":trip_name,
                "trip_id":trip_id,
                "company_abbr": company_abbr,
                "remarks": remarks
            }
        
        if payment_mode == PAYMENT_MODE["cps"] and amount is not None:
            indent = frappe.db.get_list('Indent',fields=["*"],filters={"trip":trip_name})    
            
            if indent is None or len(indent) != 1:
                frappe.throw('Customer required for Paid to supplier')
                
            customer = indent[0]['customer']
            
            cps_je_input = {
                "amount":amount,
                "supplier": supplier,
                "customer":customer,
                "payment_acc": debtor_acc,
                "creditor_acc":creditor_acc,
                "remarks" : remarks,
                "trip_id":trip_id,
            }
            
            je = create_je(cps_je_input)
            
            cps_payment_input = {
                "amount":amount,
                "supplier": supplier,
                'payment_mode' : payment_mode,
                'payment_type':'advance',
                'journal_entry':je,
                "customer":customer,
                "remarks":remarks,
                date:date,
            }
            
            payment_name = create_payment(cps_payment_input)
            
            cps_input = {
                "amount":amount,
                "payment_mode":payment_mode,
                "payment": payment_name,
                "customer":customer,
                **trip_payment_input,
            }    
            
            create_trip_payment(cps_input)            
            
        if (payment_mode == PAYMENT_MODE["cash"]) and amount is not None:
            
            # payment_mode = PAYMENT_MODE["cash"]
            payment_acc = f'{CHART_OF_ACCOUNT["cash"]} {company_abbr}'
            
            cash_je_input = {
                "amount":amount,
                "supplier": supplier,
                "payment_acc": payment_acc,
                "creditor_acc":creditor_acc,
                "remarks" : remarks,
                "trip_id":trip_id
            }
            
            je = create_je(cash_je_input)
            
            payment_input = {
                "amount":amount,
                "supplier": supplier,
                'payment_mode' : payment_mode,
                'payment_type':'advance',
                'journal_entry':je,
                "remarks":remarks,
                date:date,
            }
            
            payment_name = create_payment(payment_input)
            
            cash_input = {
                "amount":amount,
                "payment_mode":payment_mode,
                "payment": payment_name,
                **trip_payment_input,
            }        
            
            create_trip_payment(cash_input)
            
        if (payment_mode == PAYMENT_MODE["bank"]) and amount is not None:
            
            bank_input = {
                'amount':amount,
                "payment_mode":payment_mode,
                "supplier_bank": supplier_bank,
                **trip_payment_input,
            }
            create_trip_payment(bank_input)  
            
    return               


# -----------------------------------
# Author: Nithishwar
# Func: create_je
# Usage: used to create journal entry for supplier advance payment

def create_je(supplier_payment_je):
    payment_account = supplier_payment_je.get("payment_acc")
    amount = supplier_payment_je.get("amount")
    creditor_acc = supplier_payment_je.get("creditor_acc")
    supplier = supplier_payment_je.get("supplier")
    customer = supplier_payment_je.get("customer")
    remarks = supplier_payment_je.get("remarks")
    trip_id = supplier_payment_je.get("trip_id")
    
    je_items = [{
        "idx": 1,
        "account": payment_account,
        "party_type": "Customer" if customer is not None else None,
        "party": customer,        
        "credit_in_account_currency": amount,
        "is_advance": 'Yes',
        "user_remark":trip_id
    },{
        "idx": 2,
        "account": creditor_acc,
        "party_type": "Supplier",
        "party": supplier,
        "debit_in_account_currency": amount,
        "is_advance": 'Yes',
        "user_remark":trip_id
    }]
    
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

#-----------------------------------------        
def create_trip_payment(trip_payment_input):
    
    trip_id = trip_payment_input.get('trip_id')
    trip_name = trip_payment_input.get('trip_name')
    payment_mode = trip_payment_input.get('payment_mode')
    supplier = trip_payment_input.get('supplier')
    amount = trip_payment_input.get('amount')
    payment = trip_payment_input.get('payment')
    supplier_bank = trip_payment_input.get('supplier_bank')
    remarks = trip_payment_input.get('remarks')
    customer = trip_payment_input.get('customer')
    
    new_trip_payment = frappe.get_doc({
            "doctype": "Trip Payment",
            "supplier":supplier,
            "amount":amount,
            "trip":trip_name,
            "remarks":remarks,
            "customer":customer,
            "date": now(),
            "trip_id":trip_id,
            "supplier_bank":supplier_bank,
            "payment_type": PAYMENT_TYPE['advance'],
            "payment_mode":payment_mode,
            "status": PAYMENT_STATUS['requested'] if payment_mode == PAYMENT_MODE['bank'] else PAYMENT_STATUS['processed'],
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
        })
    
    new_trip_payment.insert()
    trip_payment_name = new_trip_payment.name
    
    if payment is not None:
        frappe.db.set_value('Trip Payment', trip_payment_name, {
            'payment': payment
        })
        
    return trip_payment_name

#-----------------------------------------        
def create_payment(payment_input):
    payment_mode  = payment_input.get('payment_mode')
    payment_type  = payment_input.get('payment_type')
    amount = payment_input.get('amount')
    supplier = payment_input.get('supplier')
    customer = payment_input.get('customer')
    journal_entry = payment_input.get('journal_entry')
    date = payment_input.get('date')
    remarks = payment_input.get('remarks')

    new_payment = frappe.get_doc({
            "doctype": "Payment",
            "supplier":supplier,
            "amount":amount,
            "customer":customer,
            "journal_entry": journal_entry,
            "date": date if date is not None else now(),
            "payment_type": PAYMENT_TYPE[payment_type.lower()],
            "payment_mode":payment_mode,
            "remarks": remarks,
            "trip_count":1,
            "status": PAYMENT_STATUS['processed'],
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
        })

    new_payment.insert()
    payment_name = new_payment.name
    
    return payment_name    