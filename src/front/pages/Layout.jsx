import { Outlet } from "react-router-dom/dist"
import { useLocation } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const Layout = () => {
    const location = useLocation();
    const isProfile = location.pathname.startsWith("/trainer/");
    return (
        <ScrollToTop>
            {isProfile ? (
                <Navbar />
            ) : (
                <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                    <Navbar />
                </div>
            )}
            <Outlet />
            <Footer />
        </ScrollToTop>
    )
}