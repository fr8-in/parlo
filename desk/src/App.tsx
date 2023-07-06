import { FrappeProvider } from 'frappe-react-sdk'
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes';
import { ThemeProvider } from '@mui/material/styles';
import theme from './layout/theme';

const App = (props: any) => {

    return (
        <FrappeProvider url=''>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </FrappeProvider>
    )
}

// http://parlo.localhost:8000/
export default App
