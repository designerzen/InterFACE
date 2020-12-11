const ghpages = require('gh-pages')

// delete all none folders in dest/
console.log("Deploying to github pages")
ghpages.publish('dist',{dotfiles: true}, function(err) {

	console.log("Deployed!")
})