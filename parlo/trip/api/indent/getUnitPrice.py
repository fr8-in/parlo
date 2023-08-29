import frappe

#Author : prasanth
#Description : this function is used to get the  price master amount with unitprice_input.
@frappe.whitelist()
def getUnitPrice(unitprice_input):

    customer = unitprice_input.get('customer')
    default_rate_type = unitprice_input.get('rate_type')
    source = unitprice_input.get('source')
    destination = unitprice_input.get('destination')
    print({
      "customer":customer,
      "default_rate_type":default_rate_type,
      "source":source,
      "destination":destination
    })
    amount = frappe.db.get_all("Price Master", fields=["amount"]  , filters={"customer":customer,"default_rate_type":default_rate_type , "to":destination , "from" : source})
    if(len(amount) == 1):
        response = amount[0].get('amount',0)
    else:
        response = 0
    return response

    