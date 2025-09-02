const express = require('express');
const app = express();
const serverless = require('serverless-http');
const connectDB = require('../../connections/db');
// const url = require('../../Module').url;
// const Get_Req = require('../../Requests/Get_Req');
// const nanoId = require('nano-id');
const cors = require('cors')
const path = require('path');
const appRoutes = require('../../src/routes/index');


app.use(cors(
    {
        origin: ['*', 'http://localhost:3000','https://d-shop-sage.vercel.app'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    }
))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB()

// // Initialize GET request routes from your module
// Get_Req(app, url);

// Use middleware to parse JSON
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/api/v1',appRoutes)

//remove this before deployment
// app.listen(5000, () => {
//     console.log('Server is running on port 5000');
// });
// module.exports = app;

module.exports.handler = serverless(app, { callbackWaitsForEmptyEventLoop: false });
