# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

# import frappe
import frappe
from parlo.trip.api.payments.calculate_trip_balance import calculate_trip_balance
from frappe.model.document import Document

class TripCharge(Document):
	def after_insert(self):
		self.calculate_charge()
		calculate_trip_balance(self.trip)
         
	def on_update(self):
		self.calculate_charge()
		calculate_trip_balance(self.trip)

	def calculate_charge(self):
     
		trip_charges = frappe.db.get_list('Trip Charge',fields=["*"],filters={
			"trip":self.trip,
			"charge_type": ['!=',"Price"]
		})
		
		add_charge = sum(map(lambda trip_charge:trip_charge['supplier_amount'] or 0,filter(lambda trip_charge: trip_charge['supplier_amount'] > 0,trip_charges)))
		reduce_charge = sum(map(lambda trip_charge:trip_charge['supplier_amount'] or 0,filter(lambda trip_charge: trip_charge['supplier_amount'] < 0,trip_charges)))

		frappe.db.set_value('Trip',self.trip,{
			'add_charge': add_charge,
   			'reduce_charge':reduce_charge
		})