const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Página inicial");
})

require('./controllers/authController')(app);
require('./controllers/projectController')(app);

app.listen(3000);
