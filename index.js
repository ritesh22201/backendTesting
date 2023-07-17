const express = require('express');
const connection = require('./db');
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoute');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(express.json());
app.use(cors());
app.use('/users', userRouter);
app.use('/posts', postRouter)


app.get('/', (req, res) => {
    res.send('Hi from Homepage');
})

app.listen(process.env.port, async () => {
    try {
        await connection;
        console.log('Connected to the DB');
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running at port ${process.env.port}`);
})
