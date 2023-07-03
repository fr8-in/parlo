from datetime import date
from frappe.utils.data import now
from parlo.util.constants import *
import frappe

@frappe.whitelist()
def customer_invoice_je(customer_invoice_je_input):
    indent_names = customer_invoice_je_input.get('indent_names')
    print('indent_names',indent_names)
    je_account = []
    
    # get company to construct chart of account
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')    
    
    for indent_name in indent_names:
        indent = frappe.get_doc('Indent',indent_name)

        indent_charges = frappe.db.get_list('Indent Charge List',fields=["*"],filters={  "indent":indent_name },order_by = "creation asc")
        
        for indent_charge in indent_charges:
            
            je_account_item = get_je_expense_item({
                "indent_charge":indent_charge,
                "indent":indent,
                "company_abbr":company_abbr
            })
            
            je_account.append(je_account_item) 
            
    # debit_sum = sum(map(lambda account:account['debit_in_account_currency'],filter( lambda account: 'debit_in_account_currency' in  account,je_account)))
    credit_sum = sum(map(lambda account:account['credit_in_account_currency'],filter( lambda account: 'credit_in_account_currency' in  account,je_account)))
    
    # balance =  debit_sum - credit_sum
    
    debtors_acc = f'{CHART_OF_ACCOUNT.get("debtors")} {company_abbr}'

    balance_item = {
        "account":debtors_acc,
        "debit_in_account_currency":credit_sum,
        "party_type": "Customer",
        "party": indent.get('customer')
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
    
    print('create_je_input',create_je_input)
    
    new_je = frappe.get_doc({
            "creation": now(),
            "owner": frappe.session.user,
            **create_je_input
        })
    
    new_je.insert()
    je_name = new_je.name
    
    return je_name
            

def get_je_expense_item(je_expense_input):
        indent_charge = je_expense_input.get('indent_charge')
        indent = je_expense_input.get('indent')
        company_abbr = je_expense_input.get('company_abbr')
        
        indent_charge_type = indent_charge['charge_type']
        indent_id = indent.get('id')
        amount = indent_charge['amount']
        expense_acc = CHART_OF_ACCOUNT['expense']
        revenue_acc = CHART_OF_ACCOUNT['revenue']
        other_expense_acc = expense_acc['administrative_expense']
        account_mapper = {
            'Price':revenue_acc['sales'],
            'TDS':expense_acc['tds']
        }
        remarks = f'{indent_id} - {indent_charge_type}'
        
        account = f'{account_mapper[indent_charge_type] if indent_charge_type in  account_mapper else  other_expense_acc} {company_abbr}'
        
        je_account_item = {
            "account": account,
            "credit_in_account_currency": amount,
            "user_remark":remarks
        }
        
        return je_account_item            