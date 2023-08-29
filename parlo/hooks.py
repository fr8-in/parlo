# import importlib
from . import __version__ as app_version

app_name = "parlo"
app_title = "Parlo"
app_publisher = "Digitify.app"
app_description = "Part Load Management integrated with ERPNext"
app_email = "info@digitify.app"
app_license = "MIT"


def get_whitelisted_methods():
  return {"parlo": "trip.confirm.confirm_trip"}
    
# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/parlo/css/parlo.css"
# app_include_js = "/assets/parlo/js/parlo.js"

# include js, css files in header of web template
# web_include_css = "/assets/parlo/css/parlo.css"
# web_include_js = "/assets/parlo/js/parlo.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "parlo/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
#	"methods": "parlo.utils.jinja_methods",
#	"filters": "parlo.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "parlo.install.before_install"
# after_install = "parlo.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "parlo.uninstall.before_uninstall"
# after_uninstall = "parlo.uninstall.after_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "parlo.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
#	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
#	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
#	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
#	"*": {
#		"on_update": "method",
#		"on_cancel": "method",
#		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
#	"all": [
#		"parlo.tasks.all"
#	],
#	"daily": [
#		"parlo.tasks.daily"
#	],
#	"hourly": [
#		"parlo.tasks.hourly"
#	],
#	"weekly": [
#		"parlo.tasks.weekly"
#	],
#	"monthly": [
#		"parlo.tasks.monthly"
#	],
# }

# Testing
# -------

# before_tests = "parlo.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
#	"frappe.desk.doctype.event.event.get_events": "parlo.event.get_events"
# }
#
# each overriding function accepts a `data` argument;
# generated from the base implementation of the doctype dashboard,
# along with any modifications made in other Frappe apps
# override_doctype_dashboards = {
#	"Task": "parlo.task.get_dashboard_data"
# }

# exempt linked doctypes from being automatically cancelled
#
# auto_cancel_exempted_doctypes = ["Auto Repeat"]

# Ignore links to specified DocTypes when deleting documents
# -----------------------------------------------------------

# ignore_links_on_delete = ["Communication", "ToDo"]

# Request Events
# ----------------
# before_request = ["parlo.utils.before_request"]
# after_request = ["parlo.utils.after_request"]

# Job Events
# ----------
# before_job = ["parlo.utils.before_job"]
# after_job = ["parlo.utils.after_job"]

# User Data Protection
# --------------------

# user_data_fields = [
#	{
#		"doctype": "{doctype_1}",
#		"filter_by": "{filter_by}",
#		"redact_fields": ["{field_1}", "{field_2}"],
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_2}",
#		"filter_by": "{filter_by}",
#		"partial": 1,
#	},
#	{
#		"doctype": "{doctype_3}",
#		"strict": False,
#	},
#	{
#		"doctype": "{doctype_4}"
#	}
# ]

# Authentication and authorization
# --------------------------------

# auth_hooks = [
#	"parlo.auth.validate"
# ]

after_install = "parlo.install.after_install"
website_route_rules = [{'from_route': '/desk/<path:app_path>', 'to_route': 'desk'},]