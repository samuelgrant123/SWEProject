import express from 'express';
import router from './routes/routes.js'
import cors from 'cors'

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

//Mount the endpoints
app.use("/api", router);

//To handle errors gracefully
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});
  
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'An internal server error occurred' });
});

//Start the server
app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
)