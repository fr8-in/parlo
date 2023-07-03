import frappe

# Author: Nithishwar
# Get price master data for given customer,lane and rate_type
@frappe.whitelist()
def get_price_master(pmInput):
    
    customer = pmInput.get('customer')
    source = pmInput.get('from')
    destination = pmInput.get('to')
    rateType = pmInput.get('rateType')
    
    lane = frappe.db.get_list(
            'Lane',
            filters={
                'from':source,
                'to':destination
                },
            fields=['name']
            )

    if not lane: 
        return None 
    
    priceMaster = frappe.db.get_list(
            'Price Master',
            filters={
                'lane':lane[0].name,
                'customer':customer,
                'default_rate_type':rateType
                },
            fields=['*']
            )
    
    return priceMaster


@frappe.whitelist()
def confirm_trip(confirmTripInput):
    print('confirmTripInput',confirmTripInput)
    return confirmTripInput