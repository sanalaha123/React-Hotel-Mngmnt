import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const UserLayout = () => {
    return (
        <div className="app">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
