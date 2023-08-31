

import frappe
from frappe.utils.data import now

# Author: Nithishwar S
# Function: update_indent_in_trip

@frappe.whitelist()
def update_indent_in_trip(updateIndentInput):
        print('updateIndentInput',updateIndentInput)
        trip_name = updateIndentInput.get('trip')
        indents = updateIndentInput.get('indents')
        
        values = {"trip": trip_name,"confirmed_at": now()}
        for indent in indents:
            print('indent',indent)
            frappe.set_value("Indent", indent, values)
            
            
        trip  = frappe.get_doc('Trip',trip_name)
        indent_count = trip.get('indent_count') + len(indents)
        
        frappe.set_value("Trip", trip_name, {"indent_count":indent_count})
        
        return trip