

import frappe
from frappe.utils.data import now

# Author: Nithishwar S
# Function: Confirm_trip

 
@frappe.whitelist()
def get_or_add_series_customer(addSeriesCustomerInput):
        print('confirmTripInput',addSeriesCustomerInput)
        name = addSeriesCustomerInput.get('name')
        series = addSeriesCustomerInput.get('series')
        
        name = addSeriesCustomerInput.get('customer_name')
        pan = addSeriesCustomerInput.get('pan')
        
        customers = frappe.db.get_list('Customer',filters={
                'customer_name':name
                },
            fields=['name'])

        customer = None        
        
        for i in range(len(customers)):
            customer = customers[0].name
            
        if customer is None:
            
            new_customer = frappe.get_doc({
                "doctype": "Customer",
                "tax_id": pan,
                "customer_name":name,
                "customer_type":"Company",
                "customer_group":"All Customer Groups",
                "territory":"India",
                "creation": now(),
                "owner": frappe.session.user
            })

            new_customer.insert()
            
            customer = new_customer.name
            print('new customer creation',new_customer.name)
            
        print('customer',customer,series)
        
        customerSerieses =   frappe.db.get_list('Customer Naming Series', filters={
            'customer':customer,
            'naming_series': series
        })
        
        print('customerSerieses series',customer,series,customerSerieses)
        customerSeries = None
        
        for i in range(len(customerSerieses)):
            customerSeries = customerSerieses[0]        
        
        if customerSeries is None:
        
            new_customer_series = frappe.get_doc({
                "doctype": "Customer Naming Series",
                "customer":customer,
                "naming_series":series,
                "creation": now(),
                "owner": frappe.session.user
            })

            new_customer_series.insert()
        
            customerSeries = new_customer_series
            print('new customerSeries creation',new_customer_series.name)
            
        print('customer',customer,series)
        return customer
        