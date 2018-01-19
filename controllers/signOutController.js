module.exports = {
    index: (req, res) => {
        console.log("SIGN OUT", req.session);
        req.session.destroy();
        console.log("SIGN OUT", req.session);
        res.redirect("/");
    }
};