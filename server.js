require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 5050;
const userRoute = require('./routes/userRoute');


//setup
app.use(cors());
app.use(express.json());

//user routes
app.use('/user', userRoute);

//running the server
app.listen(PORT, () => {
    console.log(`🛰️ Launcing server on port ${PORT}`);
})