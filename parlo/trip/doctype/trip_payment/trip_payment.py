# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt
from parlo.trip.api.payments.calculate_trip_balance import calculate_trip_balance
# import frappe
from frappe.model.document import Document

class TripPayment(Document):
    
	def after_insert(self):
		print('after_insert trip_payment')
		calculate_trip_balance(self.trip)
         
	def on_change(self):
		print('on_update trip_payment')
		calculate_trip_balance(self.trip)