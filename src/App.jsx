import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ProtectedRoute from "./components/ProtectedRoute";
import { useLocation } from "react-router-dom";

import Homepage from "./pages/Homepage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import CoursePage from "./pages/CoursePage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LuroCoursesPage from "./pages/LuroCoursesPage.jsx";

const routes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/forgot-password", element: <ForgotPasswordPage /> },
    { path: "/homepage", element: <ProtectedRoute><Homepage /></ProtectedRoute> },
    { path: "/about", element: <ProtectedRoute><AboutPage /></ProtectedRoute> },
    { path: "/community", element: <ProtectedRoute><CommunityPage /></ProtectedRoute> },
    { path: "/luros", element: <ProtectedRoute><LuroCoursesPage /></ProtectedRoute> },
    { path: "/course/:courseId", element: <ProtectedRoute><CoursePage /></ProtectedRoute> },
    { path: "/profile", element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
];

function App() {
    
    const [darkMode, setDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true;
    });


    useEffect(() => {
        const theme = darkMode ? "dark" : "light";
        document.body.className = theme;
        localStorage.setItem("theme", theme);
    }, [darkMode]);

    return (
        <BrowserRouter>
            {/* Hide Navbar on root story and login pages */}
            <ConditionalNavbar darkMode={darkMode} setDarkMode={setDarkMode} />
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;

function ConditionalNavbar(props) {
    const location = useLocation();
    const hidePaths = ["/", "/login", "/register", "/forgot-password"];
    if (hidePaths.includes(location.pathname)) return null;
    return <Navbar {...props} />;
}
