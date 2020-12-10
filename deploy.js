const ghpages = require('gh-pages')
console.log("Deploying to github pages")
ghpages.publish('dist',{dotfiles: true}, function(err) {

	console.log("Deployed!")
})