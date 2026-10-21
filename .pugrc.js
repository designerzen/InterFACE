// We can pass whatever JS vars we want into the template
// by adding it here to locals
// we mainly use this for dates and versions
// but it is also handy for connecting together other data

const package = require("./package.json");
const instruments = require("./source/assets/audio/fatboy.json");
const fs = require("node:fs");
const path = require("node:path");
const localesPath = path.join(__dirname, "static", "locales");
const guideFiles = fs.readdirSync(localesPath, {withFileTypes:true})
  .filter(locale => locale.isDirectory())
  .flatMap(locale => fs.readdirSync(path.join(localesPath, locale.name))
    .filter(file => /^(instructions|directions)(?:-[a-z0-9-]+)?\.json$/i.test(file))
    .map(file => ({
      kind:file.startsWith("instructions") ? "instructions" : "directions",
      language:locale.name,
      file,
      url:`./locales/${locale.name}/${file}`
    })))
  .sort((a, b) => a.language.localeCompare(b.language) || a.file.localeCompare(b.file));

module.exports = {
  locals: {
    package,
	guideFiles,
	instrumentNames:instruments,
	instruments:instruments.map( instrument => `<li>${instrument}</li>` ).join()
  }
};
