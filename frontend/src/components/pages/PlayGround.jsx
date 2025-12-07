import React, {useCallback} from "react";

export default function PlayGround() {

    const styleFunction = useCallback((node) => {
        if(!node) return;
        const color = node.dataset.color;
        if(color) node.style.color = color;
    },[]);

    return (
            <div>
                <h1 data-color="red" ref={node => styleFunction(node)}>Welcome To The PlayGround </h1>

                <div data-color="green" ref={node => styleFunction(node)}>
                    Some Text Goes Here
                </div>
            </div>
    )
}