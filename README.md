## Parlo
Part Load Management integrated with ERPNext

## Features

- Create and manage indents and trips.
- Create custom series for customers.
- Single application provides smooth ui across web and mobie devices.
- Keeps track of all of your payment records for all the trips.
- You can club multiple indents to a single trip.

## Installation

**Prequesites** : erpNext 13 , hrms , payments , wiki

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


## Sample Screenshots


![Capture-2023-07-05-101417](https://github.com/fr8-in/parlo/assets/96983619/a03a97e1-05ec-4b7a-a504-dd697297a892)

![Capture-2023-07-05-101338](https://github.com/fr8-in/parlo/assets/96983619/bbc59dac-90d0-46f7-828d-95787ac2accd)

![Capture-2023-07-05-101449](https://github.com/fr8-in/parlo/assets/96983619/2288073f-0917-40b9-8771-24d2aa1b862c)

![Capture-2023-07-05-101601](https://github.com/fr8-in/parlo/assets/96983619/dedb68e2-4a3d-4b00-b74b-1af5dd0f2553)






#### License

MIT
