import { createTheme } from '@mui/material/styles';
import { red, blue } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#113261',
        },
        secondary: {
            main: blue[600],
        },
        error: {
            main: red[500],
        },
    },
});

export default theme;