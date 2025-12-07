import express from 'express';
import globalErrorHandling from "./src/utils/error-handling";
import router from './src/routes/test-routes';
import mongoRouter from "./src/routes/database-routes";
import connectToMongoAtlas from "./src/database/mongodb-atlas";
const app = express();
app.set("trust proxy", true);

// ----------- middlewares -----------

app.use(globalErrorHandling);
app.use(express.json());

// ------------ routes -----------
app.use('/api/tests/', router);
app.use('/api/database/', mongoRouter);

app.use((req,res,next)=>{
	res.status(404).send('404 - not found');
});

// ------------ database -----------
connectToMongoAtlas();

// ------------ server listen -----------
app.listen(3000,()=>console.log('application ready to use'));