
from parlo.trip.api.invoice.supplier_invoice_je import supplier_invoice_je
import frappe
from frappe.utils.data import now

@frappe.whitelist()
def supplier_invoice(supplier_invoice_input):
    print('supplier_invoice_input',supplier_invoice_input)
    trips = validate_supplier_invoice(supplier_invoice_input)
    trip_names = supplier_invoice_input.get('trip_names')
    invoice_je = supplier_invoice_je({"trip_names":trip_names})
    
    add_charges = sum(map(lambda trip:trip['add_charge'] or 0,trips))
    reduce_charges = sum(map(lambda trip:trip['reduce_charge'] or 0,trips))
    supplier_price = sum(map(lambda trip:trip['supplier_price'] or 0,trips))
    cases = sum(map(lambda trip:trip['cases'] or 0,trips))
    weight = sum(map(lambda trip:trip['weight'] or 0,trips))
    paid = sum(map(lambda trip:trip['paid'] or 0,trips))
    balance  = sum(map(lambda trip:trip['balance'] or 0,trips))
    supplier = trips[0]['supplier']
    
    new_supplier_invoice = frappe.get_doc({
        'doctype':'Supplier Invoice',
        "paid":paid,
        "weight":weight,
        "cases":cases,
        "add_charge":add_charges,
        "reduce_charge":reduce_charges,
        "journal_entry": invoice_je,
        "supplier_amount":supplier_price,
        "total": supplier_price + add_charges + reduce_charges,
        "supplier":supplier,
        "balance":balance,
        "trip_count":len(trips),
        "creation": now(),
        "owner": frappe.session.user,
    })
    
    print('new_supplier_invoice',new_supplier_invoice)
    new_supplier_invoice.insert()
    supplier_invoice_name = new_supplier_invoice.name
    
    invoice_trip_input = {
        "supplier_invoice_name":supplier_invoice_name,
        "trip_names": supplier_invoice_input.get('trip_names')
    }
    
    print('invoice_trip_input',invoice_trip_input)
    create_invoice_trip(invoice_trip_input)
    
    return {"supplier_invoice":supplier_invoice_name}
    
def create_invoice_trip(invoice_trip_input):
    trips = invoice_trip_input.get('trip_names')
    supplier_invoice_name = invoice_trip_input.get('supplier_invoice_name')
    print('supplier_invoice_name',supplier_invoice_name,trips)
    
    for trip in trips:
        new_invoice_trip = frappe.get_doc({
            'doctype':'Supplier Invoice Trip',
            "trip":trip,
            "supplier_invoice":supplier_invoice_name,
            "creation": now(),
            "owner": frappe.session.user,
        })
        
        new_invoice_trip.insert()
        
        trip_doc = frappe.get_doc('Trip', trip)
        trip_doc.invoiced_at = now()
        trip_doc.save()
        
        
def validate_supplier_invoice(supplier_invoice_input):
    trips = supplier_invoice_input.get('trip_names')
    
    if(trips is None or len(trips) == 0 ):
        frappe.throw('Min 1 trip is required')
        

    trip_list = frappe.db.get_list('Trip',filters={
        'name':['in',trips]
    },fields=["*"])
    print('trip_list',trip_list)
    suppliers = set(map(lambda trip: trip['supplier'],trip_list))
    
    if(len(suppliers) > 1 ):
        frappe.throw('Supplier should same for all trips')
        
    invoiced_trips = list(filter(lambda trip: trip['invoiced_at'] is not None,trip_list))

    if(len(invoiced_trips) > 0 ):
        trip = invoiced_trips[0]['id']
        frappe.throw(f'Trip {trip} already invoiced')
        
    return trip_list        


