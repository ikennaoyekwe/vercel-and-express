"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/checkmyerror', (req, res, next) => {
    next(new Error('some error message i sent for you'));
});
router.get('/checkRoute', (req, res) => {
    res.json({
        message: 'this is a test route arash',
    });
});
router.get("/getIp", (req, res) => {
    const forwarded = req.headers["x-forwarded-for"];
    let ip;
    if (typeof forwarded === "string") {
        ip = forwarded.split(",")[0];
    }
    else {
        ip = req.socket.remoteAddress; // fallback for localhost/dev
    }
    res.json({
        message: "This is the Route for getting IP address",
        latitude: 10,
        longitude: 10,
        country_name: "Nigeria",
        ip: ip,
    });
});
router.get("/newRoute", (req, res) => {
    res.json({
        message: "this is a new route",
    });
});
exports.default = router;
