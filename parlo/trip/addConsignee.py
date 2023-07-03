

import frappe
from frappe.utils.data import now

# Author: Nithishwar S
# Function: Confirm_trip

 
@frappe.whitelist()
def get_or_add_customer_consignee(addCustomerConsigneeInput):
        print('confirmTripInput',addCustomerConsigneeInput)
        customer = addCustomerConsigneeInput.get('customer')
        name = addCustomerConsigneeInput.get('consignee_name')
        pan = addCustomerConsigneeInput.get('pan')
        mobile = addCustomerConsigneeInput.get('contact')
        city = addCustomerConsigneeInput.get('city')
        pincode = addCustomerConsigneeInput.get('pincode')
        companyCode = addCustomerConsigneeInput.get('company_code')
        
        
        consignees = frappe.db.get_list('Consignee',filters={
                'consignee_name':name
                },
            fields=['name'])

        consignee = None        
        
        for i in range(len(consignees)):
            consignee = consignees[0].name
            
        consigneeContact = None
        
        if mobile is not None:
            consigneeContact = f'+91-{mobile}'        
           
        print('consignee',consignee,consigneeContact)             
        if consignee is None:
            
            new_consignee = frappe.get_doc({
                "doctype": "Consignee",
                "tax_id": pan,
                "consignee_name":name,
                "contact": consigneeContact,
                "city": city,
                "pincode":pincode,
                "company_code":companyCode,
                "consignee_type":"Company",
                "consignee_group":"All Customer Groups",
                "territory":"India",
                "creation": now(),
                "owner": frappe.session.user
            })
            print('new_consignee',new_consignee)
            new_consignee.insert()
            
            consignee = new_consignee.name
            
        customerConsignees =   frappe.db.get_list('Customer Consignee', filters={
            'customer':customer,
            'consignee': consignee
        })
        
        customerConsignee = None
            
        for i in range(len(customerConsignees)):
            customerConsignee = customerConsignees[0]        
        

        
        if customerConsignee is None:
        
            new_customer_consignee = frappe.get_doc({
                "doctype": "Customer Consignee",
                "customer":customer,
                "consignee":consignee,
                "creation": now(),
                "owner": frappe.session.user
            })

            new_customer_consignee.insert()
        
            customerConsignee = new_customer_consignee
            
            
        return consignee
    
    