// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  G_MAP_KEY: process.env.G_MAP_KEY,
  LINE_CHN_ACCTOKEN: process.env.LINE_CHN_ACCTOKEN,
};