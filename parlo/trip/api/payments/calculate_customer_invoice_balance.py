import frappe 

"""
Author: Nithishwar S
Function: calculate_customer_invoice_balance
Input: invoice_name: str
Usage: With invoice_name get 'Customer Invoice Indent' and calculate the sum of values for all indents in that invoice and update invoice balance
	   if balance is 0 then update status to Closed else Open
"""
def calculate_customer_invoice_balance(invoice_name):
    
	invoice_indents = frappe.db.get_list('Customer Invoice Indent',fields=["indent.balance","indent.received","indent.write_off"],filters={
		"customer_invoice": invoice_name
	})
 
	balance = sum(map(lambda invoice_indent:invoice_indent['balance'],invoice_indents))
	received = sum(map(lambda invoice_indent:invoice_indent['received'],invoice_indents))
	write_off = sum(map(lambda invoice_indent:invoice_indent['write_off'],invoice_indents))
    
	print('invoice_indents',write_off,invoice_indents)

	frappe.db.set_value('Customer Invoice',invoice_name,{
		"balance": balance,
		"received": received,
        "write_off": write_off,
		"status": "Closed" if balance == 0 else "Open"
	})

	return invoice_indents