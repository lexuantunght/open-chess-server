const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const initSocket = require('./utils/socket');

const app = express();

const corsOptions = {
    origin: '*',
    credentials: true
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//public folder
app.use('/static', express.static(__dirname + '/../uploads', { maxAge: '30d' }));

// simple route

const server = http.createServer(app);
initSocket(server, corsOptions);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});