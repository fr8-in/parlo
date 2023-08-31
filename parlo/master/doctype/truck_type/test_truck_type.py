# Copyright (c) 2023, Digitify.app and Contributors
# See license.txt

import frappe


from frappe.model.document import Document


class TruckType(Document):

    def validate(self):

        if self.tonnage > 100:

            frappe.throw('Tonnage cannot be more than 100')

        elif self.tonnage < 0:

            frappe.throw('Tonnage cannot be less than 0')

        elif not self.common_name:

            self.common_name = self.name1
