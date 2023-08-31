import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const Store = (props: any) => {
    const { children } = props
    const navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        const user = localStorage.getItem("currentUser")

        if (!user) {
            navigate('/login')
        } else if (location.pathname == '/login') {
            navigate('/')
        } else {
            navigate(location.pathname)
        }
    }, [])

    return (
        <>
            {children}
        </>
    )

}
