# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Ewaybill(Document):
	def after_insert(self):
		self.update_eway_in_indent()
  
	def after_delete(self):
		self.update_eway_in_indent()
     
	def update_eway_in_indent(self):
		self.created_at = self.creation	

		lrs = frappe.db.get_list('E-way bill', filters={ 'indent': self.indent },fields=['way_bill_no'],order_by='creation asc',  )	
		eway_str = ','.join(map(lambda x: x['way_bill_no'], lrs))
		print(eway_str,self.indent)
		frappe.db.set_value('Indent',self.indent,'way_bill_no',eway_str)