import {useEffect, useRef, useState} from "react";

export default function verticalMenuUseRefs() {
    const [hoveredItem, setHoveredItem] = useState(null);
    return {
        canvasRef: useRef(null),
        containerRef: useRef(null),
        menuItemsRef: useRef([]),
        requestRef: useRef(null),
        hoveredItemRef: useRef(null),
        endIconRef: useRef(null),
        hoveredItem: hoveredItem,
        setHoveredItem: setHoveredItem,
    }
}

export function changeWithForMobileUseEffect(containerRef){
    useEffect(()=>{
        if(!containerRef.current) return;
        if(window.innerWidth < 700){
            containerRef.current.classList.remove('h-[25vh]');
            containerRef.current.classList.add('h-[35vh]');
        }
    },[]);
}

export function changeHoveredItemUseEffect(hoveredItem, hoveredItemRef){
    useEffect(() => { hoveredItemRef.current = hoveredItem }, [ hoveredItem ]);
}