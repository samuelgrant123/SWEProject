import express from 'express';
import router from './routes/routes.js'
import cors from 'cors'

//Define the express backend server and port number
const app = express();
const PORT = 4000;

//Use the cors middleware and the express server
app.use(cors());
app.use(express.json());

//Mount the endpoints
app.use("/api", router);

//Start the server
app.listen(PORT, () => 
    console.log(`Server running on port ${PORT}`)
);

export default app;