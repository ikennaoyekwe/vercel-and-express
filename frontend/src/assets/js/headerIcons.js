import homeIcon from "../images/home-icon.svg";
import about from "../images/man.webp";
import contact from "../images/contact_email_icon.webp";
import tech from "../images/technology_stack.webp";
import error from "../images/error.webp";

const iconMap = {
    "/": {src: homeIcon, alt: "Home", imgWidth: "50px", imgHeight: "50px"},
    "/aboutMe": {src: about, alt: "About Me"},
    "/contactMe": {src: contact, alt: "Contact & email"},
    "/techStacks": {src: tech, alt: "Tech Stack"},
}

export default function returnIcon(pathname) {
    return iconMap[pathname] || {src: error, alt: "Error"}
}