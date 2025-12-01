import React from "react";
import {Link} from "react-router-dom";

export default function Mobile_main_page() {
    return (
        <div>
            <h1>Mobile Main Page</h1>
            <Link to="/aboutme" name="main page">goto about me page</Link>
        </div>
    );
};