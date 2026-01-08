import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import deviceMiddleware from "./middleware/device.js";
import { ipLimiter } from './middleware/rateLimit.js';
import logger from './utils/logger.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { metricsEndpoint, metricsMiddleware } from './middleware/metrics.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(metricsMiddleware)
// disable this line when running locally
app.enable('trust proxy', 1)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next)=>{
    const forwardIP =req.headers['x-forwarded-for'];
    const socketIP = req.socket.remoteAddress;
    logger.info("Incoming Request:", {
        ip: forwardIP || socketIP,
        url: req.url,
        method: req.method
    })
    next();
})

app.get('/health', (req, res)=>{
    res.status(200).send('OK');
});

// app.use(ipLimiter)


app.get("/", deviceMiddleware, (req, res)=>{
    res.status(200).render('index', {
        title: "ShortLink",
        apiUrl: process.env.BASE_URL || req.get('host')
    });
});

app.get('/metrics', metricsEndpoint)

app.use("/", router);



if(process.env.NODE_ENV != 'test'){
    const PORT = process.env.PORT;

    const server = app.listen(PORT,() => {
        logger.info(`ShortLink online on port ${PORT}`);
    });

    const shutdown = () => {
        logger.info('SIGTERM/SIGINT received. Shutting down gracefully...');
        server.close(()=>{
            logger.info('Closed out remaining connections.');
            process.exit(0);
        })

        setTimeout (()=>{
            logger.error('Could not close connections in time, forcefully shutting down');
            process.exit(1);
        },1000);
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown)

}

export default app;