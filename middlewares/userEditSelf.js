function userEditSelf(req, res, next) {
    if (req.session.userId == req.params.id) {
        next()
    } else {
        console.log(req.session.userId);
        console.log(req.params.id);
        res.redirect(`/users/${req.params.id}`)
    }
}

module.exports = userEditSelf