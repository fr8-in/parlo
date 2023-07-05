## Parlo
Part Load Management integrated with ERPNext

##Features

- Create and manage indents and trips.
- Create custom series for customers.
- Single application provides smooth ui across web and mobie devices.
- Keeps track of all of your payment records for all the trips.
- You can club multiple indents to a single trip.

##Installation

1. Install Frappe Bench
2. Create a new site:

```bash
$ bench new-site <your-site>
```
4. Install `erpNext 14`
5. Install `hrms`
6. Install `wiki`
7. Install `payments`

```bash
$ bench get-app erpnext
$ bench get-app hrms
$ bench get-app wiki
$ bench get-app payments
```

9. Install `parlo` app

   
```bash
$ bench get-app https://github.com/fr8-in/parlo
$ bench --site <your-site> install-app parlo
$ bench --site <your-site> install-app erpnext
$ bench --site <your-site> install-app hrms
$ bench --site <your-site> install-app wiki
$ bench --site <your-site> install-app payments
```

#### License

MIT
