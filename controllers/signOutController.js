module.exports = {
    index: (req, res) => {
        req.session.destroy();
        res.redirect("/");
    }
};