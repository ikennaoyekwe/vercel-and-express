import express from "express";
const router = express.Router();

router.get('/checkmyerror', (req, res, next)=>{
   next(new Error('some error message i sent for you'));
});

router.get('/checkRoute', (req, res)=>{
    res.json({
        message: 'this is a test route arash',
    })
});

router.get('/getIp', async (req, res)=>{
    const forwarded = await req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let ip;
    if (typeof forwarded === "string") {
        const ip = await (forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress);
    }else{
        ip = forwarded;
    }

    res.json({
        message: 'This is the Route for getting IP address',
        ip: ip,
    })
});

export default router;
