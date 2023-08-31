import { CssBaseline } from '@mui/material';
import { Outlet } from "react-router-dom";
import Header from './header';
import { useWindowSize } from '../lib/hooks';

const Layout = () => {
   const {height} = useWindowSize()
   const maxHeight = height - 90
    return (
        <section className={"bg-primary h-full flex flex-col"}>
            <CssBaseline />
            <Header />
            <main id="main" className={`w-full flex-1 px-2 pb-2`} >
                <section className={`bg-canvas p-2 h-full rounded-lg`}>
                    <section className="overflow-auto scrollbar" style={{ maxHeight }}>
                      <Outlet />
                    </section>
                </section>
            </main>
        </section>
    )
}

export default Layout;
