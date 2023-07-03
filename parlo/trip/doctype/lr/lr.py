# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class Lr(Document):
	def after_insert(self):
		self.update_lr_in_indent()
		self.update_is_lr_update()
    
	def after_delete(self):
		self.update_lr_in_indent()
		self.update_is_lr_update()
  
	def update_lr_in_indent(self):
		self.created_at = self.creation	

		lrs = frappe.db.get_list('Lr', filters={ 'indent': self.indent },fields=['lr_no'],order_by='creation asc',  )	
		lr_str = ','.join(map(lambda x: x['lr_no'], lrs))
		print(lr_str,self.indent)
		frappe.db.set_value('Indent',self.indent,'lr_no',lr_str)
  
	def update_is_lr_update(self):
		print('indent',self.indent)
		indentTrip = frappe.db.get_value("Indent",self.indent,"trip")
		print('indentTrip',indentTrip)
		# if(getattr(indentTrip, 'trip') is not None):
		# 	lrPendingIndent = frappe.db.get_value("Indent",{'lr_no': None,"trip":indentTrip},"trip")
		# 	print(lrPendingIndent)
		# 	if(len(lrPendingIndent) == 0):
		# 		frappe.db.set_value('Trip',indentTrip,'is_lr_updated',1)
		# 	else:
		# 		frappe.db.set_value('Trip',indentTrip,'is_lr_updated',0)

   
