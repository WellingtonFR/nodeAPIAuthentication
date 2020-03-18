const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:32768/nodeapiauthentication', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.Promise = global.Promise;

module.exports = mongoose;