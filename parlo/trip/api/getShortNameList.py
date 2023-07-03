import json
import frappe

@frappe.whitelist()
def getShortNameList(shortNameListInput):
    
    parsedInput = json.loads(shortNameListInput)
    shortName = parsedInput.get('short_name')
    series = getSeriesList(shortName)
    lanes = getLaneList(shortName)
    priceMasters = getPriceMasterList(shortName)
    print({
        "series":series,
        "lanes":lanes,
        "priceMasters":priceMasters
    })
    return {
        "series":series,
        "lanes":lanes,
        "priceMasters":priceMasters
    }

def getSeriesList(shortName):
    series = frappe.db.get_list('Naming series', filters={ 'name': ['like', f'%{shortName}%']},  fields=['*'] ,start=0,page_length=5)
    print('series',series)
    return series

def getLaneList(shortName):
    lanes = frappe.db.get_list('Lane',filters = { 'short_name': ['like', f'%{shortName}%']}, fields=['*'] ,start=0,page_length=5)
    print('lanes',lanes)
    return lanes

def getPriceMasterList(shortName):
    priceMasters = frappe.db.get_list('Price Master',filters = { 'short_name': ['like', f'%{shortName}%']},    fields=['*'] ,start=0,page_length=5)
    print('priceMasters',priceMasters)
    return priceMasters
