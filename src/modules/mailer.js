const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const { host, port, auth } = require('../config/mail');

let user = auth.user;
let pass = auth.pass;

var transport = nodemailer.createTransport({ host, port, auth: { user, pass } });

transport.use('compile', hbs({
    viewEngine: {
        extname: '.handlebars',
        defaultLayout: 'forgot_password',
        layoutsDir: './views/layouts',
        partialsDir: './views/partials',
    },
    viewPath: path.resolve("./src/resources/mail/"),
}))

module.exports = transport;