import { FrappeProvider } from 'frappe-react-sdk'
import { RouterProvider } from 'react-router-dom';
import { router } from './Routes';
import { ThemeProvider } from '@mui/material/styles';
import theme from './layout/theme';

const App = (props: any) => {

    return (
        <FrappeProvider url={import.meta.env.VITE_FRAPPE_PATH ?? ''}>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </FrappeProvider>
    )
}

export default App
