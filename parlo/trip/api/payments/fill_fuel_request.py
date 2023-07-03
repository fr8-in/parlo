from datetime import date
import frappe
from frappe.utils.data import now
from parlo.util.constants import *


"""
Author: Nithishwar S
Function: fill_fuel_request
Input:  { 
        fuel_requests:[ { name:str } ]
    }
Usage:
    * Loop fuel_requests and get fuel_request detail and validate given request is eligible to process or not
    * if eligible then create Journal Entry for that fuel station and supplier
    * then update fuel request to filled
"""
@frappe.whitelist()
def fill_fuel_request(fill_fuel_request_input):
    fuel_requests = fill_fuel_request_input.get('fuel_requests')

    # get company to construct chart of account
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')

    creditor_acc = f'{CHART_OF_ACCOUNT.get("creditors")} {company_abbr}'

    je_accounts = []
    for fuel_request in fuel_requests:
        fuel_request_name = fuel_request.get('name')
        fuel_request_detail = frappe.db.get_list('Trip Fuel',filters={"name":fuel_request_name},fields=["trip","status","trip_id","trip.supplier","fuel_station","fuel_amount","cash","fuel_station"] )[0]
        
        validate_fuel_request_fill(fuel_request_detail)
        
        trip_id = fuel_request_detail.get('trip_id')
        fuel_amount = fuel_request_detail.get('fuel_amount')
        cash = fuel_request_detail.get('cash')
        total_amount = (fuel_amount or 0) + (cash or 0)
        fuel_station = fuel_request_detail.get('fuel_station')
        supplier = fuel_request_detail.get('supplier')
        
        fuel_account = {
            "account": creditor_acc,
            "credit_in_account_currency": total_amount,
            "is_advance": 'Yes',
            "party_type": "Supplier",
            "party":fuel_station,
            "user_remark": trip_id
        }
        
        supplier_account = {
            "account": creditor_acc,
            "debit_in_account_currency": total_amount,
            "is_advance": 'Yes',
            "party_type": "Supplier",
            "party":supplier,
            "user_remark": trip_id
        }
        
        je_accounts.append(fuel_account)
        je_accounts.append(supplier_account)
        
        
    je_accounts = list(map(lambda je_account:{**je_account[1],"idx":je_account[0] + 1},enumerate(je_accounts)))        
    total_debit = sum(map(lambda account:account['debit_in_account_currency'],filter( lambda account: 'debit_in_account_currency' in  account,je_accounts)))
    total_credit = sum(map(lambda account:account['credit_in_account_currency'],filter( lambda account: 'credit_in_account_currency' in  account,je_accounts)))
    
    create_je_input = {
        **JE_DEFAULT,
        "posting_date": date.today(),
        "total_debit": total_debit,
        "total_credit": total_credit,
        "accounts": je_accounts
    }   
    
    je = create_fuel_fill_je(create_je_input)
    
    fuel_fill_input = {
        "journal_entry":je,
        "fuel_requests":fuel_requests
    }
    
    update_je_and_fuel_status(fuel_fill_input)
    
    return create_je_input        


def create_fuel_fill_je(create_je_input):
    new_je = frappe.get_doc({
            "creation": now(),
            "owner": frappe.session.user,
            **create_je_input
        })
    
    new_je.insert()
    je_name = new_je.name
    return je_name

def update_je_and_fuel_status(fuel_fill_input):
    fuel_requests = fuel_fill_input.get('fuel_requests')
    journal_entry = fuel_fill_input.get('journal_entry')
    
    for fuel_request in fuel_requests:
        frappe.db.set_value('Trip Fuel', fuel_request.get('name'), {
            'status': 'Filled',
            "journal_entry":journal_entry
        })
        
def validate_fuel_request_fill(fuel_request):
    status = fuel_request.get('status')
    trip_id = fuel_request.get('trip_id') 
    if status != 'Requested' :
        frappe.throw(f'Trip {trip_id} is already {status}, requests only can move to Filled')