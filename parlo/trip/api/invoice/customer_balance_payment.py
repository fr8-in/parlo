from datetime import date
import frappe
from parlo.util.constants import  *
from frappe.utils.data import now


@frappe.whitelist()
# balance_payment_input
def customer_balance_payment(balance_payment_input):
    invoices = balance_payment_input.get('invoices')
    mode = balance_payment_input.get('payment_mode')
    payment_mode:str = PAYMENT_MODE[mode.lower()]
    company_bank = balance_payment_input.get('company_bank')
    ref_no = balance_payment_input.get('ref_no')
    customer = balance_payment_input.get('customer')
    date = balance_payment_input.get('date')
    remarks = balance_payment_input.get('remarks')
    
    customer_invoice_payments= []
    indent_payments = []
    
    for invoice in invoices:  
        invoice_indents = validate_and_map_indent_invoice(invoice)          
        print('invoice_indents',invoice_indents)
        customer_invoice_payments.extend(invoice_indents.get('customer_invoice_payments'))
        indent_payments.extend(invoice_indents.get('indent_payments'))        


    payment_amount = sum(map(lambda customer_invoice_payment:customer_invoice_payment['amount'],customer_invoice_payments))             
    write_off = sum(map(lambda customer_invoice_payment:customer_invoice_payment['write_off'],customer_invoice_payments))             
    
    balance_je_input = {
        "amount":payment_amount + write_off,
        "customer":customer,
        "payment_mode":payment_mode,
        "indent_payments":indent_payments
    }
    
    print({"customer_invoice_payments":customer_invoice_payments,"indent_payments":indent_payments})
    balance_je = create_balance_je(balance_je_input)     
    
    
    payment_input = {
        "journal_entry":balance_je,
        "amount":payment_amount,
        "customer":customer,
        "payment_mode":payment_mode,
        "company_bank":company_bank,
        "ref_no":ref_no,
        "date":date,
        "write_off":write_off,
        "remarks":remarks,
        "indent_count":len(indent_payments)
    }

    payment = create_payment(payment_input)
    
    customer_invoice_payments = list(map(lambda invoice_payment: {**invoice_payment,"payment":payment},customer_invoice_payments))
    indent_payments = list(map(lambda indent_payment: {
        **indent_payment,"payment":payment,
        "payment_mode":payment_mode,
        "company_bank":company_bank,
        "ref_no":ref_no,
        "date":date,
        "remarks":remarks
    },indent_payments))
    
    create_indent_payment({"indent_payments":indent_payments})
    create_customer_invoice_payment({"customer_invoice_payments":customer_invoice_payments}) 
     
    return balance_je


def create_customer_invoice_payment(customer_invoice_payment_input):
    customer_invoice_payments = customer_invoice_payment_input.get('customer_invoice_payments')
    
    for customer_invoice_payment in customer_invoice_payments:
        new_customer_invoice_payment = frappe.get_doc({
           **customer_invoice_payment
        })
    
    new_customer_invoice_payment.insert()
    customer_invoice_payment_name = new_customer_invoice_payment.name
    print('customer_invoice_payment_name,',customer_invoice_payment_name)        
        
def create_indent_payment(indent_payment_input):
    indent_payments = indent_payment_input.get('indent_payments')
    
    for indent_payment in indent_payments:
        print('indent_payment',indent_payment)
        new_indent_payment = frappe.get_doc({
           **indent_payment
        })
    
        new_indent_payment.insert()
        indent_payment_name = new_indent_payment.name
        print('indent_payment_name,',indent_payment_name)        
        
    
    
def create_payment(payment_input):
    payment_mode  = payment_input.get('payment_mode')
    amount = payment_input.get('amount')
    customer = payment_input.get('customer')
    journal_entry = payment_input.get('journal_entry')
    date = payment_input.get('date')
    remarks = payment_input.get('remarks')
    company_bank = payment_input.get('company_bank')
    ref_no = payment_input.get('ref_no')
    trip_count = payment_input.get('trip_count')
    write_off = payment_input.get('write_off')
    
    new_payment = frappe.get_doc({
            "doctype": "Payment",
            "customer":customer,
            "amount":amount,
            "trip_count":trip_count,
            "journal_entry": journal_entry,
            "write_off":write_off,
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


def create_balance_je(customer_payment_je):
    
    company = frappe.get_last_doc('Company',order_by = "creation asc")
    company_abbr  = company.get('abbr')
    
    payment_mode = customer_payment_je.get('payment_mode')
    amount = customer_payment_je.get("amount")
    indent_payments = customer_payment_je.get("indent_payments")
    
    
    payment_account = f'{CHART_OF_ACCOUNT[payment_mode.lower()]} {company_abbr}'
    debtor_acc = f'{CHART_OF_ACCOUNT["debtors"]} {company_abbr}'

    customer = customer_payment_je.get("customer")
    remarks = customer_payment_je.get("remarks")
    
    je_items = [{
        "idx": 1,
        "account": payment_account,
        "debit_in_account_currency": amount,
    }]
    
    for index,indent_payment in enumerate(indent_payments):
        expense_acc = CHART_OF_ACCOUNT['expense']
        f'{CHART_OF_ACCOUNT["debtors"]} {company_abbr}'
        write_off_acc = f'{expense_acc["write_off"]} {company_abbr}'
        
        account =  write_off_acc if PAYMENT_TYPE['write_off'] == indent_payment.get('payment_type') else debtor_acc
        indent_je_item = {
            "idx": index + 2,
            "account": account,
            "party_type": None if PAYMENT_TYPE['write_off'] == indent_payment.get('payment_type') else  "Customer",
            "party": None if PAYMENT_TYPE['write_off'] == indent_payment.get('payment_type') else  customer,
            "credit_in_account_currency": indent_payment.get('amount'),
            "user_remark": indent_payment.get('indent_id')
        }
        
        je_items.append(indent_je_item)
        
    
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
    print('new_je',new_je)
    new_je.insert()
    je_name = new_je.name
    
    return je_name
    
    
    
    
    
def validate_and_map_indent_invoice(invoice):
    
    invoice_name = invoice.get('invoice_name')
    invoice_detail = frappe.get_doc('Customer Invoice',invoice_name)
    customer = invoice_detail.get('customer')
    indents = invoice.get('indents')
    indents_write_off = sum(map(lambda indent:indent.get('write_off'),indents))
    
    indents_amount = sum(map(lambda indent:indent.get('amount'),indents))
    total_indent_amount  = indents_write_off + indents_amount
    print('indents_write_off',indents_write_off,indents_amount)
    invoice_balance = invoice_detail.get('balance')
    indent_payments= []
    
    if(customer is None ):
        frappe.throw('Customer Required')
        
    if(total_indent_amount > invoice_balance):
        frappe.throw(f'Invoice {invoice_detail.name} payment amount {total_indent_amount} exceeds invoice balance {invoice_balance}')
    
    customer_invoice_payment = [{
        "doctype": "Customer Invoice Payment",
        "customer_invoice":invoice_name,
        "customer":customer,
        "amount": indents_amount,
        "write_off": indents_write_off,
        "creation": now(),
        "owner": frappe.session.user,
    }]    
    
    for indent in indents:
        
        indent_payment = {
            "doctype": "Indent Payment",
            "customer_invoice" : invoice_name,
            "customer": customer,
            "amount": indent.get('amount'),
            "date": now(),
            "indent":indent.get('name'),
            "indent_id":indent.get('id'),
            "status": PAYMENT_STATUS['processed'],
            "payment_type": PAYMENT_TYPE['balance'],
            "creation": now(),
            "owner": frappe.session.user,
        }
        indent_payments.append(indent_payment)  
        
        if indent.get('write_off') > 0:
            
            indent_write_off = {
                "doctype": "Indent Payment",
                "customer_invoice" : invoice_name,
                "customer": customer,
                "amount": indent.get('write_off'),
                "date": now(),
                "indent":indent.get('name'),
                "indent_id":indent.get('id'),
                "status": PAYMENT_STATUS['processed'],
                "payment_type": PAYMENT_TYPE['write_off'],
                "creation": now(),
                "owner": frappe.session.user,
            }
            
            indent_payments.append(indent_write_off)  
        
    
    print({"indent_payments":indent_payments,"customer_invoice_payments":customer_invoice_payment})                  
    return {"indent_payments":indent_payments,"customer_invoice_payments":customer_invoice_payment}
    