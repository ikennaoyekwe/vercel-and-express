import * as React from 'react';
import {useState} from "react";
import {Button} from "@mui/material";

export default function MyContainer() {

    const [flag, setFlag] = useState(false);
    const enlargeRectangle = () => setFlag(!flag);

    const myDiv = (
        <div className={`bg-blue-400 w-[250px] h-[200px] transition ${flag ? 'transform scale-75' : ''}`}>
            {flag && "Enlarged..."}
        </div>
    );

    return (
        <React.Fragment>
            {myDiv}
            <Button onClick={enlargeRectangle} sx={{backgroundColor: 'black', color: 'white'}}>Increase Count</Button>
        </React.Fragment>
    );
}