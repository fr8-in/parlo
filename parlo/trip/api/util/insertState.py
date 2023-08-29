import frappe

stateList =  [
  {
    "id" : 1,
    "name" : "Chhattisgarh",
    "country":"India"
  },
  {
    "id" : 4,
    "name" : "Madhya Pradesh",
    "country":"India"
  },
  {
    "id" : 6,
    "name" : "Bihar",
    "country":"India"
  },
  {
    "id" : 7,
    "name" : "Jharkhand",
    "country":"India"
  },
  {
    "id" : 8,
    "name" : "Odisha",
    "country":"India"
  },
  {
    "id" : 9,
    "name" : "West Bengal",
    "country":"India"
  },
  {
    "id" : 10,
    "name" : "Chandigarh",
    "country":"India"
  },
  {
    "id" : 11,
    "name" : "Delhi",
    "country":"India"
  },
  {
    "id" : 12,
    "name" : "Haryana",
    "country":"India"
  },
  {
    "id" : 13,
    "name" : "Himachal Pradesh",
    "country":"India"
  },
  {
    "id" : 14,
    "name" : "Jammu and Kashmir",
    "country":"India"
  },
  {
    "id" : 15,
    "name" : "Punjab",
    "country":"India"
  },
  {
    "id" : 16,
    "name" : "Uttar Pradesh",
    "country":"India"
  },
  {
    "id" : 17,
    "name" : "Uttarakhand",
    "country":"India"
  },
  {
    "id" : 18,
    "name" : "Arunachal Pradesh",
    "country":"India"
  },
  {
    "id" : 19,
    "name" : "Assam",
    "country":"India"
  },
  {
    "id" : 20,
    "name" : "Manipur",
    "country":"India"
  },
  {
    "id" : 21,
    "name" : "Meghalaya",
    "country":"India"
  },
  {
    "id" : 22,
    "name" : "Mizoram",
    "country":"India"
  },
  {
    "id" : 23,
    "name" : "Nagaland",
    "code" : "NL",
    "gst_code" : "13"
  },
  {
    "id" : 24,
    "name" : "Sikkim",
    "country":"India"
  },
  {
    "id" : 25,
    "name" : "Tripura",
    "country":"India"
  },
  {
    "id" : 26,
    "name" : "Andhra Pradesh",
    "country":"India"
  },
  {
    "id" : 27,
    "name" : "Karnataka",
    "country":"India"
  },
  {
    "id" : 28,
    "name" : "Kerala",
    "country":"India"
  },
  {
    "id" : 29,
    "name" : "Puducherry",
    "country":"India"
  },
  {
    "id" : 30,
    "name" : "Tamil Nadu",
    "country":"India"
  },
  {
    "id" : 31,
    "name" : "Telangana",
    "country":"India"
  },
  {
    "id" : 32,
    "name" : "Dadra and Nagar Haveli",
    "country":"India"
  },
  {
    "id" : 33,
    "name" : "Daman and Diu",
    "country":"India"
  },
  {
    "id" : 34,
    "name" : "Goa",
    "country":"India"
  },
  {
    "id" : 35,
    "name" : "Gujarat",
    "country":"India"
  },
  {
    "id" : 36,
    "name" : "Maharashtra",
    "country":"India"
  },
  {
    "id" : 37,
    "name" : "Rajasthan",
    "country":"India"
  },
  {
    "id" : 38,
    "name" : "Kathmandu",
    "country":"India"
  },
  {
    "id" : 39,
    "name" : "Birgunj",
    "country":"India"
  },
  {
    "id" : 40,
    "name" : "Gokarneshwor",
    "country":"India"
  },
  {
    "id" : 41,
    "name" : "Andaman and Nicobar Islands",
    "country":"India"
  },
  {
    "id" : 42,
    "name" : "Nepal",
    "country":"India"
  },
  {
    "id" : 43,
    "name" : "Bangladesh",
    "country":"India"
  }
]

#This function is to update/insert new state list to doctype state.
@frappe.whitelist()
def importStateList():
    print("EVENT STARTED..!")
    for state in stateList:
        new_state = frappe.get_doc({
            "name": state['name'],
            "owner": "Administrator",
            "name1": state['name'],
            "country": "India",
            "doctype": "State"})
        new_state.insert()
    print("EVENT ENDED..!")
