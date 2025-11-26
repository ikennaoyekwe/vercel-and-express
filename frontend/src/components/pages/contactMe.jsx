import {motion} from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        x: -100
    },
    animate: {
        opacity: 1,
        x: 0
    },
    exit: {
        opacity: 0,
        x: 100
    }
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.6
};

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