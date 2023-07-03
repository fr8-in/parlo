import { createBrowserRouter } from 'react-router-dom';
import { Store } from './context/store';
import Layout from './layout/layout';
import { ErrorPage } from './error-page';
import { Login } from './modules/Login';
import IndentList from './modules/indent';
import CreateIndent from './modules/indent/create';
import { IndentDetail } from './modules/indent/detail';
import Trip from './modules/trip';
import TripDetail from './modules/trip/detail';
import Eway from './modules/eway';
import Customer from './modules/customer';
import Consignee from './modules/consignee';
import Supplier from './modules/supplier';
import Truck from './modules/truck';
import ConfirmTrip from './modules/trip/confirm';
import PodPendingCourier from './modules/trip/pod';
import EditIndent from './modules/indent/edit';


export const router = createBrowserRouter(
    [
        {
            path: "/",
            errorElement: <ErrorPage />,
            element:
                <Store>
                    <Layout />
                </Store>
            ,
            children: [
                {
                    index: true,
                    element: <IndentList />
                },
                {
                    path: "/indent",
                    element: <IndentList  />
                },
                {
                    path: "/indent/create",
                    element: <CreateIndent />
                },
                {
                    path: "/indent/create/:tripId",
                    element: <CreateIndent />
                },
                {
                    path: "/indent/:indentId",
                    element: <IndentDetail />
                },
                {
                    path: "/trip",
                    element: <Trip />
                },
                {
                    path: "/trip/confirm/:indentIds",
                    element: <ConfirmTrip />
                },
                {
                    path: "/trip/:tripName",
                    element: <TripDetail />
                },
                {
                    path: "/eway",
                    element: <Eway />
                },
                {
                    path: "/customer",
                    element: <Customer />
                },
                {
                    path: "/consignee",
                    element: <Consignee />,
                },
                {
                    path: "/supplier",
                    element: <Supplier />,
                },
                {
                    path: "/truck",
                    element: <Truck />,
                },
                {
                    path:"/trip/podpending/courier/:indentId",
                    element:<PodPendingCourier/>
                },
                {
                    path: "/indent/edit/:indentId",
                    element: <EditIndent />,

                }

            ]
        },
       

        {
            path: "/login",
            element: <Login />
        },



    ]
);

