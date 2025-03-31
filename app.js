import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

//Mount the endpoints
app.use("/api", router);

app.listen(PORT, () => 
    console.log(`Server is running on port ${PORT}`)
)