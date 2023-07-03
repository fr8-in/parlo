import frappe
from parlo.util.constants import *


"""
Author: Nithishwar S
Function: calculate_invoice_balance
Input: invoice_name: str
Usage: With invoice_name get 'Supplier Invoice Indent' and calculate the sum of values for all trips in that invoice and update invoice balance and paid 
		if balance is 0 then update status to Closed else Open
"""
def calculate_invoice_balance(invoice_name):

	invoice_trips = frappe.db.get_list('Supplier Invoice Trip',fields=["trip.balance","trip.paid"],filters={
		"supplier_invoice": invoice_name
	})
	balance = sum(map(lambda invoice_trip:invoice_trip['balance'],invoice_trips))
	paid = sum(map(lambda invoice_trip:invoice_trip['paid'],invoice_trips))
	print('invoice_trips',invoice_trips)

	frappe.db.set_value('Supplier Invoice',invoice_name,{
		"balance": balance,
		"paid": paid,
		"status": "Closed" if balance == 0 else "Open"
	})

	return invoice_trips  