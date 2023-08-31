# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.naming import NAMING_SERIES_PART_TYPES
from frappe.utils import cstr
from frappe.utils.data import now

class Indent(Document):

	def before_insert(self):
		self.created_at = self.creation	
  
		#get naming series value for given series and update in indent ID
		series = parse_naming_series(self.series)
		
		self.id = series
		#Update insert source and destination from from_location and to_location
		self.update_indent_city()
	
	def on_change(self):
		print('on_change')
		#Update indent workflow status on update
		self.update_workflow()

	def on_update(self):
		print('on_update')     
		#Validate updated timestamp in greater that before value (ex: confirmed_at > created_at)
		# self.validate_workflow()

	def after_insert(self):
		self.add_price_in_charge()

#-------------------------------- 
	def update_indent_city(self):
		to_location = self.to
		from_location = getattr(self,'from')
  
		# customer_location = frappe.get_doc('Customer Location',from_location)
		source_location = frappe.get_doc('Locations',from_location)
  
		# consignee_location = frappe.get_doc('Consignee Location',to_location)
		destination_location = frappe.get_doc('Locations',to_location)
  
		setattr(self,'destination',destination_location.city)
		setattr(self,'source',source_location.city)
  
#-------------------------------  
	# def validate_workflow(self):
	# 	print('creation',self.creation)
  
  	# 	# Define the mapping between timestamps and workflow steps
	# 	workflow_map = {
	# 		'creation': 'Created',
	# 		'confirmed_at': 'Confirmed',
	# 		'delivered_at': 'POD Pending',
	# 		'pod_received_at': 'POD Received',
	# 		'invoiced_at': 'Invoiced',
	# 		'received_at': 'Received',
	# 	}

	# 	# Check if the timestamps follow a sequential order based on the workflow map
	# 	prev_step = None
	# 	for timestamp, step in workflow_map.items():
	# 		if getattr(self, timestamp):
	# 			if prev_step and datetime.strptime(getattr(self, timestamp), '%Y-%m-%d %H:%M:%S')  < datetime.strptime(getattr(self, prev_step), '%Y-%m-%d %H:%M:%S'):
	# 				frappe.throw(f"{step} cannot be before {workflow_map[prev_step]}")
	# 			prev_step = timestamp
    
    
#----------------------------     
	def update_workflow(self):
		print('indent on change',self.delivered_at)
  
  		# Define the mapping between timestamps and workflow steps
		workflow_map = {
			'confirmed_at': 'Confirmed',
			'delivered_at': 'POD Pending',
			'pod_received_at': 'POD Received',
			'invoiced_at': 'Invoiced',
			'received_at': 'Received',
		}

		# Update the workflow state based on the current timestamp value
		for timestamp, step in workflow_map.items():
			if getattr(self, timestamp) and self.workflow_state != step:
				frappe.db.set_value('Indent', self.name, 'workflow_state', step)
				break

	def add_price_in_charge(self):
		print('add_price_in_charge')
		new_indent_charge = frappe.get_doc({
			"doctype": "Indent Charge List",
			"indent": self.name,
			"charge_type":"Price",
			"amount": self.customer_price if self.customer_price is not None else 0,
			"creation": now(),
			"owner": frappe.session.user
		})
		
		new_indent_charge.insert()   
#-------------------------------------   
def parse_naming_series(series) -> str:
	name = ""
	count = frappe.db.count('Indent', {'series': series}) + 1
	naming_series = frappe.get_doc('Naming series',series)
 
	if isinstance(naming_series.series, str):
		parts = naming_series.series.split(".")
 
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
			name += cstr(part).sindent()

	return name