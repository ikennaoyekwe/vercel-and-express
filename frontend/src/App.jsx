import * as React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import {AnimatePresence} from "framer-motion";
import MainLayout from "./layouts/MainLayout.jsx";
import NotFound404 from "./components/pages/NotFound404.jsx";
import MainPage from "./components/pages/MainPage.jsx";
import AbouteMe from "./components/pages/abouteMe.jsx";
import ContactMe from "./components/pages/contactMe.jsx";
import TechStack from "./components/pages/techStack.jsx";
import PlayGround from "./components/pages/PlayGround.jsx";
import MovingWave from "./components/pages/pages_components/MainPage/movingWave.jsx";

function AnimatedRoutes() {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                <Route path="/" element={<MainLayout/>}>

                    <Route path="/" element={<MainPage/>}/>
                    <Route path="/aboutMe" element={<AbouteMe/>}/>
                    <Route path="/contactMe" element={<ContactMe/>}/>
                    <Route path="/techStacks" element={<TechStack/>}/>

                    <Route path="*" element={<NotFound404/>}/>
                </Route>
                <Route path="/play" element={<PlayGround />}/>
                <Route path="/wave" element={<MovingWave />}/>
            </Routes>
        </AnimatePresence>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AnimatedRoutes/>
        </BrowserRouter>
    );
}