# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

import frappe
from datetime import datetime
from frappe.model.document import Document
from frappe.model.naming import NAMING_SERIES_PART_TYPES
from frappe.utils.data import cstr, now

class Trip(Document):
	def before_insert(self):
			series = parse_naming_series(self.series)
			print('series',series)
			self.id = series
			self.confirmed_at = self.creation
  

	def on_update(self):
		#Validate updated timestamp in greater that before value (ex: confirmed_at > created_at)
		# self.validate_workflow()
		#Update indent workflow status on update
		print('self',self.delivered_at)
		self.update_workflow()  
   			
#-------------------------------  
	# def validate_workflow(self):
	# 	if( (self.paid_at is not None and len(f'{self.paid_at}') > 0 ) and (self.pod_received_at is None or  self.paid_at < self.pod_received_at)):
	# 		frappe.throw('Paid cannot be before POD Received')
	# 	elif( (self.pod_received_at is not None and len(f'{self.pod_received_at}') > 0 ) and (self.delivered_at is None or  self.pod_received_at < self.delivered_at)):
	# 		frappe.throw('POD Received cannot be before POD Pending')
	# 	elif( (self.delivered_at is not None and len(f'{self.delivered_at}') > 0 ) and (self.confirmed_at is None or  datetime.strptime(self.delivered_at, '%Y-%m-%d %H:%M').date() <  self.confirmed_at)):
	# 		frappe.throw('POD Pending cannot be before Confirmed')

#------------------------------
	def update_workflow(self):
		print('invoiced_at',self.workflow_state,self.invoiced_at)		
		
		if ((self.deleted_at is not None and len(f'{self.deleted_at}') > 0) and (self.workflow_state != 'Cancelled' )):
			frappe.db.set_value('Trip',self.name,'workflow_state','Cancelled')

		elif ((self.paid_at is not None and len(f'{self.paid_at}') > 0) and (self.workflow_state != 'Paid' )):
			print('paid_at',self.workflow_state,self.paid_at)
			frappe.db.set_value('Trip',self.name,'workflow_state','Paid')

		elif ((self.invoiced_at is not None and len(f'{self.invoiced_at}') > 0) and (self.workflow_state != 'Invoiced' )):
			
			frappe.db.set_value('Trip',self.name,'workflow_state','Invoiced')   
   
		elif ((self.pod_received_at is not None and len(f'{self.pod_received_at}') > 0) and (self.workflow_state != 'POD Received' )):
				frappe.db.set_value('Trip',self.name,'workflow_state','POD Received')
			
		elif ((self.delivered_at is not None  and len(f'{self.delivered_at}') > 0) and (self.workflow_state != 'POD Pending' )):
				print('POD Pending',self.delivered_at )
				frappe.db.set_value('Trip',self.name,'workflow_state','POD Pending')
				update_indent_delivereed(self.name)

		elif ((self.confirmed_at is not None and len(f'{self.confirmed_at}') > 0) and (self.workflow_state != 'Confirmed' )):
				print('POD Pending',self.delivered_at )
				frappe.db.set_value('Trip',self.name,'workflow_state','Confirmed')
		else:
			pass


# ----------------------------------
def update_indent_delivereed(trip):
    
    indents = frappe.db.get_list('Indent',filters={ "trip": trip })
    print('indents',indents)
    values = {"delivered_at": now(),'workflow_state':'POD Pending'}
    print('values',values)
    for indent in indents:
        print('indent.name',indent.name)
        frappe.db.set_value("Indent", indent.name, values)
        

#-------------------------------------
def parse_naming_series(series) -> str:
	name = ""
	count = frappe.db.count('Trip') + 1
	print('count,',count)
	parts = "TRP-.#####".split(".")
  
	for e in parts:
		if not e:
			continue

		part = ""
               
		if e.startswith("#"):
			part = e.replace("#", "0")[:-len(str(count))] + str(count)
		else:
			part = e

		if isinstance(part, str):
			name += part
		elif isinstance(part, NAMING_SERIES_PART_TYPES):
			name += cstr(part).strip()

	return name