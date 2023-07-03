import { Button, Card, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { message } from "antd";
import { useFrappeAuth } from "frappe-react-sdk";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";


export const Login = () => {

    const { login } = useFrappeAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    let location = useLocation();

    useEffect(() => {
        const user = localStorage.getItem("currentUser")

        if (user && location.pathname == '/login') {
            navigate('/')
        }

    }, [])

    const handleLogin = async (event: any) => {
        event.preventDefault();
        try {
            await login(username, password)
            localStorage.setItem("currentUser", username)
            navigate('/')
            // Redirect to the home page or display a success message
        } catch (error:any) {
            message.error(`${error?.message}`)
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                width: '100vw',
                overflow: 'auto',
            }}>
            <Card sx={{ maxWidth: 320, padding: 2, alignSelf: 'center', borderRadius: 3, width: '100%' }}>
                <h2 className={"text-blue-600 mb-4"}>Login Track</h2>
                <form onSubmit={handleLogin}>
                    <TextField
                        id="outlined-basic"
                        value={username}
                        type='text'
                        label="Username"
                        autoComplete="off"
                        sx={{ mb: 2, width: '100%' }}
                        variant="outlined"
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <TextField
                        id="outlined-basic"
                        value={password}
                        autoComplete="off"
                        type='password'
                        label="Password"
                        variant="outlined"
                        sx={{ mb: 2, width: '100%' }}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <div className="text-right">
                        <Button variant='contained' type="submit">Login</Button>
                    </div>
                </form>
            </Card>
        </Box>

    )
}