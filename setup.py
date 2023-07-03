from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in parlo/__init__.py
from parlo import __version__ as version

setup(
	name="parlo",
	version=version,
	description="Part Load Management integrated with ERPNext",
	author="Digitify.app",
	author_email="info@digitify.app",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
