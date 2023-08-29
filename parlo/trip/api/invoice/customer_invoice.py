from frappe.utils.data import now
from parlo.trip.api.invoice.customer_invoice_je import customer_invoice_je
import frappe

@frappe.whitelist()
def customer_invoice(customer_invoice_input):
    
    indents = validate_customer_invoice(customer_invoice_input)
    indent_names = customer_invoice_input.get('indent_names')
    print('indent_names',indent_names)
    print('indents',indents)
    company_address = customer_invoice_input.get('company_address')
    customer_address = customer_invoice_input.get('customer_address')
    courier = customer_invoice_input.get('courier')
    courier_date = customer_invoice_input.get('courier_date')
    docket_no = customer_invoice_input.get('docket_no')
    dispatched_by = customer_invoice_input.get('dispatched_by')
    remarks = customer_invoice_input.get('remarks')
    indent  = indents[0]
    customer = indent.get('customer')
    series = indent.get('series')
    
    invoice_je = customer_invoice_je({"indent_names":indent_names})
    add_charges = sum(map(lambda indent:indent['add_charge'] or 0,indents))
    reduce_charges = sum(map(lambda indent:indent['reduce_charge'] or 0,indents))
    customer_price = sum(map(lambda indent:indent['customer_price'] or 0,indents))
    cases = sum(map(lambda indent:indent['cases'] or 0,indents))
    weight = sum(map(lambda indent:indent['weight'] or 0,indents))
    received = sum(map(lambda indent:indent['received'] or 0,indents))
    balance  = sum(map(lambda indent:indent['balance'] or 0,indents))

    new_customer_invoice = frappe.get_doc({
        'doctype':'Customer Invoice',
        "series" :series,
        "received":received,
        "weight":weight,
        "cases":cases,
        "add_charge":add_charges,
        "company_address":company_address,
        "customer_address":customer_address,
        "reduce_charge":reduce_charges,
        "remarks":remarks,
        "courier":courier,
        "journal_entry": invoice_je,
        "dispatched_by":dispatched_by,
        "courier_date":courier_date,
        "docket_no":docket_no,
        "customer_price":customer_price,
        "total": customer_price + add_charges + reduce_charges,
        "customer":customer,
        "balance":balance,
        "indent_count":len(indents),
        "creation": now(),
        "owner": frappe.session.user,
    })
    
    new_customer_invoice.insert()
    customer_invoice_name = new_customer_invoice.name
    
    invoice_trip_input = {
        "customer_invoice_name":customer_invoice_name,
        "indent_names": indent_names
    }
    
    create_invoice_indent(invoice_trip_input)
    
    return {"customer_invoice":customer_invoice_name}
    
def create_invoice_indent(invoice_indent_input):
    indents = invoice_indent_input.get('indent_names')
    customer_invoice_name = invoice_indent_input.get('customer_invoice_name')
    print('customer_invoice_name',customer_invoice_name,indents)
    
    for indent in indents:
        new_invoice_indent = frappe.get_doc({
            'doctype':'Customer Invoice Indent',
            "indent":indent,
            "customer_invoice":customer_invoice_name,
            "creation": now(),
            "owner": frappe.session.user,
        })
        
        new_invoice_indent.insert()
        
        indent_doc = frappe.get_doc('Indent', indent)
        indent_doc.invoiced_at = now()
        indent_doc.save()


        
def validate_customer_invoice(customer_invoice_input):
    indent_names = customer_invoice_input.get('indent_names')
    
    if(indent_names is None or len(indent_names) == 0 ):
        frappe.throw('Min 1 indent is required')
        
    indent_list = frappe.db.get_list('Indent',filters={
        'name':['in',indent_names]
    },fields=["*"])
    customers = set(map(lambda indent: indent['customer'],indent_list))
    
    if(len(customers) > 1 ):
        frappe.throw('Customer should same for all indents')
        
    invoiced_indents = list(filter(lambda indent: indent['invoiced_at'] is not None,indent_list))

    if(len(invoiced_indents) > 0 ):
        indent = invoiced_indents[0]['id']
        frappe.throw(f'Indent {indent} already invoiced')
        
    return indent_list        
    