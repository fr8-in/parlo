import frappe

"""
@author : Prasanth.M
@description : Below functions are used to prepopulate the data when the app is installed.It uses after_install hook to insert the data in the doctypes.
"""

"""
@author : Prasanth.M
@function : prepopulate_states
@description : Used to fill the default indian states when the app is installed.
"""
def prepopulate_states():
    # JSON data containing the list of Indian states
    states_data = [
  {
    "name1": "Andhra Pradesh",
    "country": "India"
  },
  {
    "name1": "Arunachal Pradesh",
    "country": "India"
  },
  {
    "name1": "Assam",
    "country": "India"
  },
  {
    "name1": "Bihar",
    "country": "India"
  },
  {
    "name1": "Chhattisgarh",
    "country": "India"
  },
  {
    "name1": "Goa",
    "country": "India"
  },
  {
    "name1": "Gujarat",
    "country": "India"
  },
  {
    "name1": "Haryana",
    "country": "India"
  },
  {
    "name1": "Himachal Pradesh",
    "country": "India"
  },
  {
    "name1": "Jharkhand",
    "country": "India"
  },
  {
    "name1": "Karnataka",
    "country": "India"
  },
  {
    "name1": "Kerala",
    "country": "India"
  },
  {
    "name1": "Madhya Pradesh",
    "country": "India"
  },
  {
    "name1": "Maharashtra",
    "country": "India"
  },
  {
    "name1": "Manipur",
    "country": "India"
  },
  {
    "name1": "Meghalaya",
    "country": "India"
  },
  {
    "name1": "Mizoram",
    "country": "India"
  },
  {
    "name1": "Nagaland",
    "country": "India"
  },
  {
    "name1": "Odisha",
    "country": "India"
  },
  {
    "name1": "Punjab",
    "country": "India"
  },
  {
    "name1": "Rajasthan",
    "country": "India"
  },
  {
    "name1": "Sikkim",
    "country": "India"
  },
  {
    "name1": "Tamil Nadu",
    "country": "India"
  },
  {
    "name1": "Telangana",
    "country": "India"
  },
  {
    "name1": "Tripura",
    "country": "India"
  },
  {
    "name1": "Uttar Pradesh",
    "country": "India"
  },
  {
    "name1": "Uttarakhand",
    "country": "India"
  },
  {
    "name1": "West Bengal",
    "country": "India"
  }
]
    
    # Loop through the JSON data and insert each state into the custom doctype
    for state_info in states_data:
        state_doc = frappe.get_doc({
            "doctype": "State",  # Replace with your actual doctype name
            "name1": state_info["name1"],    # Field name for the state name
            "country": state_info["country"]     # Field name for the country
        })
        state_doc.insert()


"""
@author : Prasanth.M
@function : prepopulate_payment_type
@description : Used to fill the default Payment Types when the app is installed.
"""
def prepopulate_payment_type():
      # JSON data containing the list of Payment Types
      default_payment_type=[
        {
            "doctype":"Payment Type",
            "name1" : "Advance"
        },
        {
            "doctype":"Payment Type",
            "name1" : " Balance"
        },
        {
            "doctype":"Payment Type",
            "name1" : "Fuel"
        },
        {
            "doctype":"Payment Type",
            "name1" : "On Delivery"
        },
        {
            "doctype":"Payment Type",
            "name1" : "Write Off"
        }
    ]
      for default_payment_type_data in default_payment_type:
        default_payment_type_doc = frappe.get_doc({
            "doctype": "Payment Type",
            "name1": default_payment_type_data["name1"],   
        })
        default_payment_type_doc.insert()

"""
@author : Prasanth.M
@function : prepopulate_default_payment_mode
@description : Used to fill the default Payment Modes when the app is installed.
"""
def prepopulate_default_payment_mode():
   # JSON data containing the list of Payment Modes
    default_payment_mode=[
        {
            "doctype":"Payment Mode",
            "name1" : "Cash"
        },
        {
            "doctype":"Payment Mode",
            "name1" : " Bank"
        },
        {
            "doctype":"Payment Mode",
            "name1" : "CPS"
        },
    ]
    for default_payment_mode_data in default_payment_mode:
      default_payment_mode_doc = frappe.get_doc({
            "doctype": "Payment Mode",
            "name1": default_payment_mode_data["name1"],   
        })
      default_payment_mode_doc.insert()
    
"""
@author : Prasanth.M
@function : def prepopulate_truck_type():
@description : Used to fill the default Truck Types when the app is installed.
"""
def prepopulate_truck_type():
  # JSON data containing the list of Truck Types
   default_truck_types = [
        {
            "doctype": "Truck Type",
            "code": "SXL",
            "common_code":"32 SXL",
            "common_name":"32 Single Axle",
            "tonnage": 7.0,
            "is_per_case":False,
            "is_per_kg":False,
            "name1":"32 Single Axle",
        },
          {
            "doctype": "Truck Type",
            "code": "Rate Per Quintal",
            "common_code":"Rate Per Quintal",
            "common_name":"Rate Per Quintal",
            "tonnage":0.00,
            "is_per_case":False,
            "is_per_kg":True,
            "name1":"Rate Per Quintal",
        },
           {
            "doctype": "Truck Type",
            "code": "Rate Per Case",
            "common_code":"Rate Per Case",
            "common_name":"",
            "tonnage":0.00,
            "is_per_case":True,
            "is_per_kg":False,
            "name1":"Rate Per Case",
        }
    ]
   for default_truck_types_data in default_truck_types:
        default_truck_types_doc = frappe.get_doc({
            "doctype": "Truck Type", 
            "name1": default_truck_types_data["name1"],   
            "code": default_truck_types_data["code"],   
            "common_code": default_truck_types_data["common_code"],   
            "is_per_case": default_truck_types_data["is_per_case"],   
            "tonnage": default_truck_types_data["tonnage"],   
            "is_per_kg": default_truck_types_data["is_per_kg"],   
        })
        default_truck_types_doc.insert()

"""
@author : Prasanth.M
@function : insert_charge_type
@description : Used to insert default charge types during installation.
"""
def insert_charge_type():
    doc = frappe.get_doc({
      "doctype": "Charge type", 
      "name1":"Price"
    })
    doc.insert()

def after_install():
  prepopulate_states()
  prepopulate_payment_type()
  prepopulate_default_payment_mode()
  prepopulate_truck_type()