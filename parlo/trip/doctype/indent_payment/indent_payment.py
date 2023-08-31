# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

# import frappe
from parlo.trip.api.payments.calculate_indent_balance import calculate_indent_balance
from frappe.model.document import Document

class IndentPayment(Document):
	def after_insert(self):
		print('after_insert indent_payment')
		calculate_indent_balance(self.indent)
         
	def on_change(self):
		print('on_update indent_payment')
		calculate_indent_balance(self.indent)
