const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:32768/nodeapiauthentication', { useMongoClient: true, useNewUrlParser: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;