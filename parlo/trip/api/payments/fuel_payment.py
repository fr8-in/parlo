from datetime import date
from parlo.trip.api.payments.calculate_trip_balance import calculate_trip_balance
from parlo.trip.api.invoice.supplier_balance_payment import create_trip_payment
import frappe
from frappe.utils.data import now
from parlo.util.constants import *
from parlo.trip.api.payments.supplier_payment import create_payment


"""
Author: Nithishwar S
Function: fuel_payment
Input:  {
           trip_fuel_names : [str],
           supplier : str,
           supplier_bank: str,
           company_bank: str,
           ref_no: str,
           date: datetime,
           remarks: str,
           payment_mode: str
        }
Usage:
    * Validate given request if is eligible to process then
    * calculate total fuel_amount and cash_amount
    * create Journal Entry for fuel as amount paid to fuel_station 
    * create Payment Entry and update JE in that
    * Update fuel request to Processed status and payment
"""
@frappe.whitelist()
def fuel_payment(fuel_payment_input):
    
    # Validate user input and get fuel_request and trip_payment details
    trip_fuel_input = validate_and_get_supplier_fuel_payment(fuel_payment_input)
    # User Input
    trip_fuels = trip_fuel_input.get('trip_fuels')
    trip_payments = trip_fuel_input.get('trip_payments')
    supplier = fuel_payment_input.get('supplier')
    company_bank = fuel_payment_input.get('company_bank')
    supplier_bank = fuel_payment_input.get('supplier_bank')
    ref_no = fuel_payment_input.get('ref_no')
    date = fuel_payment_input.get('date')
    remarks = fuel_payment_input.get('remarks')
    payment_mode = fuel_payment_input.get('payment_mode')
    fuel_amount = sum(map(lambda trip_fuel: trip_fuel['fuel_amount'], trip_fuels))
    cash = sum(map(lambda trip_fuel: trip_fuel['cash'], trip_fuels))
    total_amount = fuel_amount + cash
    
    je_input = {
        'trip_fuels':trip_fuels,
        'total_amount':total_amount,
        'supplier':supplier,
        'remarks':remarks,
        'ref_no':ref_no,
        'date':date,
        'payment_mode': payment_mode
    }
    
    je = create_fuel_je(je_input)
    
    payment_input = {
        "amount":total_amount,
        "supplier": supplier,
        'payment_mode' : payment_mode,
        'payment_type':'fuel',
        'journal_entry':je,
        "remarks":remarks,
        "trip_count":len(trip_fuels),
        date:date,
    }
    
    payment = create_payment(payment_input)
    
    # trip_payments
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
    
    for trip_fuel in trip_fuels:
        
        frappe.db.set_value('Trip Fuel', trip_fuel.name, {
            'status': PAYMENT_STATUS['processed'],
        })
        
        calculate_trip_balance(trip_fuel.trip)
    return je


def create_fuel_je(je_input):
    
    trip_fuels = je_input.get('trip_fuels')
    ref_no = je_input.get('ref_no')
    ref_date = je_input.get('date')
    remarks = je_input.get('remarks')
    total_amount = je_input.get('total_amount')
    supplier = je_input.get('supplier')
    payment_mode:str = je_input.get('payment_mode')
    
    trip_fuel = trip_fuels[0]
    payment_type = 'fuel'
    
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

    for index,trip_fuel in enumerate(trip_fuels):
        
        fuel_amount = trip_fuel.get('fuel_amount')
        cash = trip_fuel.get('cash')
        total_amount = fuel_amount + cash
        je_item = {
            "idx": index + 2,
            "account": creditor_acc,
            "party_type": "Supplier",
            "party": supplier,
            "debit_in_account_currency": total_amount,
            "is_advance": 'Yes',
            "user_remark": trip_fuel.get('trip_id')
        }
        
        je_items.append(je_item)
    
    create_je_input = {
        **JE_DEFAULT,
        "posting_date": date.today(),
        "total_debit": total_amount,
        "total_credit": total_amount,
        "accounts": je_items,
        "cheque_no": ref_no  if ref_date is not None else None,
        "cheque_date": ref_date if ref_no is not None else None,
        "user_remark": remarks
    }   
    
    new_je = frappe.get_doc({
            "creation": now(),
            "confirmed_at": now(),
            "owner": frappe.session.user,
            **create_je_input
        })
    
    new_je.insert()
    
    return new_je.name



# # Func: validate_supplier_fuel_payment
# # Author: Nithishwar
# # Usage: check given input value are valid or not
def validate_and_get_supplier_fuel_payment(fuel_payment):        
    trip_fuel_names = fuel_payment.get('trip_fuel_names')
    fuel_station = fuel_payment.get('supplier')
    supplier_bank = fuel_payment.get('supplier_bank')
    payment_mode:str = fuel_payment.get('payment_mode')
    ref_no = fuel_payment.get('ref_no')
    date = fuel_payment.get('date')    
    
    # Check payment requeste is there are not
    if len(trip_fuel_names) == 0:
        frappe.throw('Minimum one trip request is required')
    
    # Check supplier is there or not
    if fuel_station is None:
        frappe.throw('Fuel station is required')
    
    # Check supplier bank if it is bank transaction is there or not    
    if payment_mode.lower() == 'bank' and supplier_bank is None:
        frappe.throw('Supplier bank account is required')
    
    # Check supplier is there or not    
    if payment_mode.lower() == 'bank' and ( ref_no is None or date is None ):
        frappe.throw('Referene and Date is required')
        
        
    trip_fuel_other_fuel_station = frappe.db.get_list('Trip Fuel', filters={
        'name': ['in', trip_fuel_names],
        'fuel_station': ['!=',fuel_station]
    })
    
    if len(trip_fuel_other_fuel_station) > 0:
        frappe.throw('Fuel station should same for payment')

    trip_fuels = frappe.db.get_list('Trip Fuel', filters={
        'name': ['in', trip_fuel_names]
    },fields=["*"])        
    
    unique_payment_mode_list = list(set(trip_fuel.payment_mode for trip_fuel in trip_fuels))       
    
    if len(unique_payment_mode_list) > 1:
        frappe.throw('Payment modes cannot be mix up')
    
    processed_list = list(filter( lambda trip_payment: trip_payment.status == 'Processed' ,trip_fuels))       
    cancelled_list = list(filter( lambda trip_payment: trip_payment.status == 'Cancelled' ,trip_fuels))       
    
    if len(processed_list) > 1:
        frappe.throw(f'{len(processed_list)} trips fuel already processed')
        
    if len(cancelled_list) > 1:
        frappe.throw(f'{len(cancelled_list)} trips fuel are cancelled ')
        
    trip_payments = []        
    for trip_fuel in trip_fuels:
        
        trip_payment = {
            "doctype": "Trip Payment",
            "supplier": fuel_station,
            "amount": trip_fuel.get('fuel_amount') + trip_fuel.get('cash'),
            "trip_fuel": trip_fuel.get('name'),
            "date": now(),
            "trip":trip_fuel.get('trip'),
            "trip_id":trip_fuel.get('trip_id'),
            "status": PAYMENT_STATUS['processed'],
            "payment_type": PAYMENT_TYPE['fuel'],
            "creation": now(),
            "owner": frappe.session.user,
        }
    
        trip_payments.append(trip_payment) 
                    
        
    return {
        "trip_fuels":trip_fuels,
        "trip_payments":trip_payments
        }



    
