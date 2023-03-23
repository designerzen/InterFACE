// We can pass whatever JS vars we want into the template
// by adding it here to locals
// we mainly use this for dates and versions
// but it is also handy for connecting together other data

const package = require("./package.json");
const instruments = require("./source/assets/audio/fatboy.json");

module.exports = {
  locals: {
    package,
	instruments:instruments.map( instrument => `<li>${instrument}</li>` ).join()
  }
};