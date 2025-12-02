import React from "react";
import { pageVariants, pageTransition} from "../../utils/framer-motion-objects.js";
import {motion} from "framer-motion";
import MyThreeJs from "../test_components/ThreeJs/myThreeJs.jsx";
import MovingWave from "../test_components/ThreeJs/movingWave.jsx";

export default function PlayGround() {

    return (
        <motion.div initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
            <MovingWave/>
        </motion.div>
    )
}