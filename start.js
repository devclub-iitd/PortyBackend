require('@babel/register')({
    presets: ['@babel/preset-env'],
});

require('dotenv').config({ path: `${__dirname}/.env` });

// Import the rest of our application.
module.exports = require('./src/server');
