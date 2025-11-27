import * as React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {BrowserView, MobileView} from "react-device-detect";
import {AnimatePresence} from "framer-motion";
import MainLayout from "./components/pages/MainLayout.jsx";
import NotFound404 from "./components/pages/NotFound404.jsx";
import MainPage from "./components/pages/MainPage.jsx";
import AbouteMe from "./components/pages/AbouteMe.jsx";
import ContactMe from "./components/pages/ContactMe.jsx";
import TechStack from "./components/pages/TechStack.jsx";
import Mobile_main_layout from "./components/pages/mobile_view/mobile_main_layout.jsx";
import Mobile_main_page from "./components/pages/mobile_view/mobile_main_page.jsx";
import Mobile_aboute_me from "./components/pages/mobile_view/mobile_aboute_me.jsx";

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <>
            <BrowserView>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<MainLayout/>}>

                            <Route path="/" element={<MainPage/>}/>
                            <Route path="/aboutMe" element={<AbouteMe/>}/>
                            <Route path="/contactMe" element={<ContactMe/>}/>
                            <Route path="/techStacks" element={<TechStack/>}/>

                            <Route path="*" element={<NotFound404/>}/>

                        </Route>
                    </Routes>
                </AnimatePresence>
            </BrowserView>
            <MobileView>
                <Routes>
                    <Route path="/" element={<Mobile_main_layout/>}>

                        <Route path="/" element={<Mobile_main_page/>}/>
                        <Route path="/aboutme" element={<Mobile_aboute_me/>}/>
                        {/*<Route path="/contactMe" element={<ContactMe/>}/>*/}
                        {/*<Route path="/techStacks" element={<TechStack/>}/>*/}

                        {/*<Route path="*" element={<NotFound404/>}/>*/}

                    </Route>
                </Routes>
            </MobileView>
        </>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AnimatedRoutes/>
        </BrowserRouter>
    );
}