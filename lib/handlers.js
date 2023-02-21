exports.home = (req, res) => res.render("home")
exports.about = (req, res) => res.render("about")
exports.serverError = (req,res) => res.render("500")
exports.notFound = (req,res) => res.render("404")
