# Copyright (c) 2023, Digitify.app and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
# from frappe.model.naming import NAMING_SERIES_PART_TYPES, determine_consecutive_week_number, getseries
# from frappe.utils import cint, cstr, now_datetime

class Indents(Document):
    pass
# 	def after_insert(self):
# 		doc = frappe.get_doc('Naming series', self.series)
# 		series = parse_naming_series(doc.series)
		
# 		frappe.throw(f'{series}')


# def parse_naming_series(parts) -> str:
# 	name = ""
# 	if isinstance(parts, str):
# 		parts = parts.split(".")
  
# 	count = frappe.db.count('Indent', {'series': parts})
# 	series_set = False
# 	today = now_datetime()
# 	for e in parts:
# 		if not e:
# 			continue

# 		part = ""
# 		if e.startswith("#"):
# 			frappe.throw(f'{e}')
# 			if not series_set:
# 				digits = len(e)
# 				part = "0023"
# 				series_set = True
# 		elif e == "YY":
# 			part = today.strftime("%y")
# 		elif e == "MM":
# 			part = today.strftime("%m")
# 		elif e == "DD":
# 			part = today.strftime("%d")
# 		elif e == "YYYY":
# 			part = today.strftime("%Y")
# 		elif e == "WW":
# 			part = determine_consecutive_week_number(today)
# 		elif e == "timestamp":
# 			part = str(today)
# 		elif e == "FY":
# 			part = frappe.defaults.get_user_default("fiscal_year")
# 		else:
# 			part = e

# 		if isinstance(part, str):
# 			name += part
# 		elif isinstance(part, NAMING_SERIES_PART_TYPES):
# 			name += cstr(part).strip()

# 	return name