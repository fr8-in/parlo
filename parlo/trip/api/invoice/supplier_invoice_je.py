from datetime import date
from frappe.utils.data import now
from parlo.util.constants import *
import frappe


def supplier_invoice_je(supplier_invoice_je_input):
    trip_names = supplier_invoice_je_input.get('trip_names')
    print('trip_names',trip_names)
    je_account = []

    # get company to construct chart of account
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')
        
    for trip_name in trip_names:
        trip = frappe.get_doc('Trip',trip_name)

        trip_charges = frappe.db.get_list('Trip Charge',fields=["*"],filters={  "trip":trip_name },order_by = "creation asc")
        
        for trip_charge in trip_charges:
            
            je_account_item = get_je_expense_item({
                "trip_charge":trip_charge,
                "trip":trip,
                "company_abbr":company_abbr
            })
            
            je_account.append(je_account_item)
            
        # Advance processed no need to add in invoice ( discussed on 19-Jun-23)
        # trip_payments = frappe.db.get_list('Trip Payment',fields=["*"],filters={
        #     "trip":trip_name,
        #     "status": PAYMENT_STATUS['processed']
        # })    
        
        # payment_amount = sum(map(lambda trip_payment:trip_payment['amount'] or 0,trip_payments))    
    
        # if(payment_amount is not None and payment_amount > 0):
        #     current_advance = CHART_OF_ACCOUNT['current_advance']
        #     payment_item = {
        #         "account":f'{current_advance} {company_abbr}',
        #         "credit_in_account_currency":payment_amount
        #     }
            
        #     je_account.append(payment_item)            
    
    debit_sum = sum(map(lambda account:account['debit_in_account_currency'],filter( lambda account: 'debit_in_account_currency' in  account,je_account)))
    credit_sum = sum(map(lambda account:account['credit_in_account_currency'],filter( lambda account: 'credit_in_account_currency' in  account,je_account)))
    
    # balance =  debit_sum - credit_sum
    
    creditor_acc = f'{CHART_OF_ACCOUNT.get("creditors")} {company_abbr}'

    balance_item = {
        "account":creditor_acc,
        "credit_in_account_currency":debit_sum,
        "party_type": "Supplier",
        "party": trip.get('supplier')
    }
    
    je_account.append(balance_item)            
          
    total_debit = sum(map(lambda account:account['debit_in_account_currency'],filter( lambda account: 'debit_in_account_currency' in  account,je_account)))
    total_credit = sum(map(lambda account:account['credit_in_account_currency'],filter( lambda account: 'credit_in_account_currency' in  account,je_account)))
    map_je_account = list(map( lambda index_and_account: {**index_and_account[1],"idx":index_and_account[0] + 1} ,enumerate(je_account)))
                  
    create_je_input = {
        **JE_DEFAULT,
        "posting_date": date.today(),
        "total_debit": total_debit,
        "total_credit": total_credit,
        "accounts": map_je_account
    }
    
    new_je = frappe.get_doc({
            "creation": now(),
            "owner": frappe.session.user,
            **create_je_input
        })
    
    new_je.insert()
    je_name = new_je.name
    
    return je_name



def get_je_expense_item(je_expense_input):
        trip_charge = je_expense_input.get('trip_charge')
        trip = je_expense_input.get('trip')
        company_abbr = je_expense_input.get('company_abbr')
        
        trip_charge_type = trip_charge['charge_type']
        trip_id = trip.get('id')
        amount = trip_charge['supplier_amount']
        expense_acc = CHART_OF_ACCOUNT['expense']
        other_expense_acc = expense_acc['administrative_expense']
        account_mapper = {
            'Price':expense_acc['cost_of_goods_sold'],
            'TDS':expense_acc['tds']
        }
        remarks = f'{trip_id} - {trip_charge_type}'
        
        account = f'{account_mapper[trip_charge_type] if trip_charge_type in  account_mapper else  other_expense_acc} {company_abbr}'
        
        je_account_item = {
            "account": account,
            "debit_in_account_currency": amount,
            "user_remark":remarks
        }
        
        return je_account_item