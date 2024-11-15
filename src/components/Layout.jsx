import '../styles/layout.css';
import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import SideNav from './Sidenav.jsx';

const Layout = () => {
    return (
        <div className="layout">
            <Header />
            <div className="inner-layout-container">
                <SideNav />
                <main>
                    <Outlet />
                </main>
                    
            </div>
        </div>
    );
}

export default Layout;