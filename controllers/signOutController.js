module.exports = {
  index: (req, res) => {
    req.session.destroy((err) => {
      console.log(req.session);
      if (err)
        console.error(err)
      else
        res.redirect("/");

    });
  }
};
