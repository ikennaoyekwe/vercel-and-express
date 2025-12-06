import homeIcon from "../images/home-icon.svg";
import about from "../images/man.webp";
import contact from "../images/contact_email_icon.webp";
import tech from "../images/technology_stack.webp";
import error from "../images/error.webp";

const iconMap = {
    "/": {imgSrc: homeIcon, imgAlt: "Home", imgWidth: "50px", imgHeight: "50px"},
    "/aboutMe": {imgSrc: about, imgAlt: "About Me"},
    "/contactMe": {imgSrc: contact, imgAlt: "Contact & email"},
    "/techStacks": {imgSrc: tech, imgAlt: "Tech Stack"},
}

export default function returnIcon(pathname) {
    return iconMap[pathname] || {imgSrc: error, imgAlt: "Error"}
}