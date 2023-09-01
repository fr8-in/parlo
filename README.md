## Parlo

Parlo is a user-friendly solution for simplifying part load management. If you're involved in transportation with part loads, Parlo is here to make your logistics smoother. This app is crafted using the [Frappe Framework](https://frappeframework.com/) and seamlessly integrates with [ERPNext](https://erpnext.com/), ensuring a seamless experience for optimizing your transportation operations.

**Key Features**:

1. **Create and Manage Indents**: Easily create and manage indents for your trips, ensuring a clear and organized record of all your transportation needs.

2. **Custom Series for Customers**: Customize series for your customers, making it easy to differentiate and manage trips for each client.

3. **Responsive UI**: Enjoy a smooth and user-friendly interface that adapts seamlessly to both web and mobile devices, ensuring you can manage your operations from anywhere.

4. **Payment Records**: Keep precise track of all payment records related to your trips, including fuel expenses, bank requests, cash requests, and more.

5. **Consolidate Indents**: Efficiently group multiple indents into a single trip, reducing complexity and optimizing your transportation planning.

6. **Part Load Management**: Use the integrated Parlo app to manage part loads, ensuring maximum utilization of your vehicles and resources.

7. **Customer and Supplier Management**: Manage your customer and supplier relationships within the app. Create new customer and supplier profiles, ensuring accurate and up-to-date records.

8. **Driver and Truck Management**: Keep track of your drivers and trucks, assigning them to specific trips and ensuring a well-coordinated logistics operation.

## Tech Stack

Parlo is built using the [Frappe Framework](https://frappeframework.com) - an open-source full stack development framework. 

The frontend is built using React and the following libraries:

1. [MUI](https://mui.com) , [Ant.design](https://ant.design) - UI components
2. [frappe-react-sdk](https://github.com/nikkothari22/frappe-react-sdk) - simple React hooks to interface with a Frappe framework backend.
3. [MUI-Icons](https://mui.com/material-ui/material-icons/) - Icon set
4. [react-hook-forms](https://www.react-hook-form.com) - Controlled Forms
5. [tailwindcss](https://tailwindcss.com) - CSS


## Installation

Since Parlo is a Frappe app, it can be installed via [frappe-bench](https://frappeframework.com/docs/v14/user/en/bench) on your local machine or on your production site.

Once you have [setup your bench](https://frappeframework.com/docs/v14/user/en/installation) and your [site](https://frappeframework.com/docs/v14/user/en/tutorial/install-and-setup-bench), you can install the app via the following commands:

```bash
bench get-app https://github.com/fr8-in/parlo.git
bench --site your-site install-app parlo
```

Post this, you can access Parlo on your Frappe site at the `/parlo` endpoint (e.g. https://yoursite.com/parlo). 

### Local development setup

To set up your local development environment, make sure that you have enabled [developer mode](https://frappeframework.com/docs/user/en/guides/app-development/how-enable-developer-mode-in-frappe) in your Frappe site config.

You also need to disable CSRF (add `ignore_csrf: 1` in your `site_config.json`) since the React web server will not have any CSRF token in live reload mode. If you are working on the mobile app, you would also need to allow CORS (add `allow_cors: "*"` in your `site_config.json`). Please note that this is only for the local dev setup - not meant for Production. 

You can start the React live web server by:

```bash
cd frappe-bench/apps/parlo
yarn dev
```

Your local dev server would be running at `http://localhost:8080`.

## Future Plans
1. Eway Integration
2. Payments Integrations
3. LR (Lorry Receipt) Generation.

## Reporting Bugs

If you find any bugs, feel free to report them on [Github Issues](https://github.com/fr8-in/parlo/issues). Kindly share screenshots / console logs also if possible , so that it will be usefull for the team to test and fix.

## Sample Screenshots

|           |           |
|-----------|-----------|
| ![Image 1](https://github.com/fr8-in/parlo/assets/96983619/2288073f-0917-40b9-8771-24d2aa1b862c) Create Indent | ![Image 2](https://github.com/fr8-in/parlo/assets/96983619/dedb68e2-4a3d-4b00-b74b-1af5dd0f2553) Create Trip |
| ![Image 3](https://github.com/fr8-in/parlo/assets/96983619/bbc59dac-90d0-46f7-828d-95787ac2accd) Trip Detail | ![Image 4](https://github.com/fr8-in/parlo/assets/77272730/5165437f-76c6-4dc5-bc35-231bc415029d) All Trips |


<hr>


#### License

MIT
