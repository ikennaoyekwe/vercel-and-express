import {motion} from "framer-motion";
import {pageVariants, pageTransition} from "../../utils/framer-motion-objects.js";

export default function ContactMe() {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
        >
            <div className="flex flex-col text-center min-h-[90vh] justify-center items-center">
                <h1 className="font-bold text-xl">Contact Me Page :</h1><br/>
                <h3 className="text-lg">will be filled soon</h3>
            </div>
        </motion.div>
    )
}