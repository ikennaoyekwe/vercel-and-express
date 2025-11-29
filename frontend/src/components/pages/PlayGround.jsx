import React, {useEffect, useRef, useState} from "react";
import { pageVariants, pageTransition} from "../../utils/framer-motion-objects.js";
import {motion} from "framer-motion";
import ThreejsCube from "../test_components/threejsCube.jsx";

export default function PlayGround() {

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>

            <ThreejsCube />

        </motion.div>
    )
}