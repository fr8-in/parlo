# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

# import frappe
import frappe
from parlo.trip.api.payments.calculate_indent_balance import calculate_indent_balance
from frappe.model.document import Document

class IndentChargeList(Document):
	def after_insert(self):
		self.calculate_charge()
		calculate_indent_balance(self.indent)
         
	def on_update(self):
		self.calculate_charge()
		calculate_indent_balance(self.indent)	

	def calculate_charge(self):
     
		indent_charges = frappe.db.get_list('Indent Charge List',fields=["*"],filters={
			"indent":self.indent,
			"charge_type": ['!=',"Price"]
		})
		
		add_charge = sum(map(lambda indent_charge:indent_charge['amount'] or 0,filter(lambda indent_charge: indent_charge['amount'] > 0,indent_charges)))
		reduce_charge = sum(map(lambda indent_charge:indent_charge['amount'] or 0,filter(lambda indent_charge: indent_charge['amount'] < 0,indent_charges)))
  
		print('add_charge,reduce_charge',add_charge,reduce_charge)

		frappe.db.set_value('Indent',self.indent,{
			'add_charge': add_charge,
   			'reduce_charge':reduce_charge
		})

