require('dotenv').config();
const express = require('express');
const DbConnect = require('./database');
const router = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');


const app = express();
const corsOption = {
    credentials : true,
    origin: ['http://localhost:3000'],
};
app.use(cookieParser());
app.use(cors(corsOption));
app.use('/storage', express.static('storage'));
const PORT = process.env.PORT || 5500;

app.use(express.json({limit : '8mb'}));
app.use(router);

app.get('/', (req, res) => {
    res.send('Hello from express js');
});


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
    DbConnect();
});