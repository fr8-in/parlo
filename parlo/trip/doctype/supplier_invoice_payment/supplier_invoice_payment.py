# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

# import frappe
from parlo.trip.api.payments.calculate_invoice_balance import calculate_invoice_balance
import frappe
from frappe.model.document import Document

class SupplierInvoicePayment(Document):

	def after_insert(self):
		calculate_invoice_balance(self.supplier_invoice)
  
	def on_change(self):
		calculate_invoice_balance(self.supplier_invoice)
  