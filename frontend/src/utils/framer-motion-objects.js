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

export { pageVariants, pageTransition };