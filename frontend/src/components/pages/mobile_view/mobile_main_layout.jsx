import React from "react";
import {Outlet} from "react-router-dom";

export default function Mobile_main_layout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/*<Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu}/>*/}
            <div>
                This is the Mobile Header
            </div>
            <main>
                <Outlet/>
            </main>
            <div>
                This is the Mobile Footer
            </div>
            {/*<Footer/>*/}
        </div>
    )
}