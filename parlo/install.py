import frappe

def after_install():
    insert_default_truck_type()
    insert_default_payment_type()
    insert_default_payment_mode()
    insert_default_indian_state()
    
def insert_default_truck_type() :
    default_truck_types = [
        {
            "doctype": "Truck Type",
            "code": "SXL",
            "common_code":"32 SXL",
            "name":"32 Single Axle",
            "common_name":"",
            "tonnage":0.00,
            "is_per_case":False,
            "is_per_kg":False
        },
         {
            "doctype": "Truck Type",
            "code": "SXL",
            "common_code":"32 SXL",
            "name":"32 Single Axle",
            "common_name":"",
            "tonnage":0.00,
            "is_per_case":False,
            "is_per_kg":False
        },
          {
            "doctype": "Truck Type",
            "code": "Rate Per Quintal",
            "common_code":"Rate Per Quintal",
            "name":"Rate Per Quintal",
            "common_name":"",
            "tonnage":0.00,
            "is_per_case":False,
            "is_per_kg":True
        },
           {
            "doctype": "Truck Type",
            "code": "Rate Per Case",
            "common_code":"Rate Per Case",
            "name":"Rate Per Case",
            "common_name":"",
            "tonnage":0.00,
            "is_per_case":True,
            "is_per_kg":False
        }
    ]
    
    for truck_type in default_truck_types:
        new_truck_type = frappe.get_doc(truck_type)
        new_truck_type.insert()

def insert_default_payment_type():
    default_payment_type=[
        {
            "doctype":"Payment Type",
            "name" : "Advance"
        },
        {
            "doctype":"Payment Type",
            "name" : " Balance"
        },
        {
            "doctype":"Payment Type",
            "name" : "Fuel"
        },
        {
            "doctype":"Payment Type",
            "name" : "On Delivery"
        },
        {
            "doctype":"Payment Type",
            "name" : "Write Off"
        }
    ]
    
    for payment_types in default_payment_type:
        new_payment_type = frappe.get_doc(payment_types)
        new_payment_type.insert()
        
def insert_default_payment_mode():
    default_payment_mode=[
        {
            "doctype":"Payment Mode",
            "name" : "Cash"
        },
        {
            "doctype":"Payment Mode",
            "name" : " Bank"
        },
        {
            "doctype":"Payment Mode",
            "name" : "CPS"
        },
    ]
    
    for payment_mode in default_payment_mode:
        new_payment_mode = frappe.get_doc(payment_mode)
        new_payment_mode.insert()
        
def insert_default_indian_state():
    default_state = [
  {
    "doctype":"State",
    "name": "Andhra Pradesh",
    "country": "India"
  },
  {
    "doctype":"State",
    "name": "Arunachal Pradesh",
    "country": "India"
  },
  {
    "doctype":"State",
    "name": "Assam",
    "country": "India"
  },
  {
    "doctype":"State",
    "name": "Bihar",
    "country": "India"
  },
  {
    "doctype":"State",
    "name": "Chhattisgarh",
    "country": "India"
  },
  {
    "doctype":"State",
    "name": "Goa",
    "country": "India"
  },
  {
    "doctype":"State",
    "name": "Gujarat",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Haryana",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Himachal Pradesh",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Jharkhand",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Karnataka",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Kerala",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Madhya Pradesh",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Maharashtra",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Manipur",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Meghalaya",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Mizoram",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Nagaland",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Odisha",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Punjab",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Rajasthan",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Sikkim",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Tamil Nadu",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Telangana",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Tripura",
    "country": "India"
  },
  {
    "name": "Uttar Pradesh",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "Uttarakhand",
    "country": "India"
  },
  {
   "doctype":"State",
    "name": "West Bengal",
    "country": "India"
  }
]

    for state in default_state:
        new_state = frappe.get_doc(state)
        new_state.insert()
