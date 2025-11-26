import * as React from 'react';
import './App.css';
import MainLayout from "./components/pages/MainLayout.jsx";
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";
import { AnimatePresence} from "framer-motion";
import NotFound404 from "./components/pages/NotFound404.jsx";
import MainPage from "./components/pages/MainPage.jsx";
import AbouteMe from "./components/pages/abouteMe.jsx";
import ContactMe from "./components/pages/contactMe.jsx";
import TechStack from "./components/pages/techStack.jsx";

function AnimatedRoutes(){
    const location = useLocation();
    return(
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<MainLayout/>}>

                    <Route path="/" element={<MainPage />}/>
                    <Route path="/aboutMe" element={<AbouteMe />}/>
                    <Route path="/contactMe" element={<ContactMe />}/>
                    <Route path="/techStacks" element={<TechStack />}/>

                    <Route path="*" element={<NotFound404 />}/>

                </Route>
            </Routes>
        </AnimatePresence>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <AnimatedRoutes />
        </BrowserRouter>
    );
}













// import AddBooksForm from "./components/test_components/AddBooksForm.jsx";
// import UpdateBooksSimpleTransitions from "./components/test_components/UpdateBooksSimpleTransitions.jsx";
// import MUI_Main from "./layouts/MUI_Main.jsx";
// import Mui_Main_Layout from "./layouts/mui_layouts/Mui_Main_Layout.jsx";

// export default function App() {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 <Route path="/" element={<MainLayout/>}>
//
//                     <Route path="/" element={<MainPage />}/>
//
//                     <Route path="/updatebooks" element={<UpdateBooksSimpleTransitions />}/>
//                     <Route path="/addbooks" element={<AddBooksForm />}/>
//                     <Route path="/mui" element={<Mui_Main_Layout/>}/>
//                     <Route path="/showbooks" element={<div className="flex flex-col text-center min-h-[90vh] justify-center items-center">Get & Show Books Page Here</div>}/>
//
//                     <Route path="/aboutMe" element={<AbouteMe />}/>
//                     <Route path="/contactMe" element={<ContactMe />}/>
//                     <Route path="/techStacks" element={<TechStack />}/>
//
//                     <Route path="*" element={<NotFound404 />}/>
//                 </Route>
//                 <Route path="/materialui" element={<Mui_Main_Layout/>}/>
//             </Routes>
//         </BrowserRouter>
//     )
// }