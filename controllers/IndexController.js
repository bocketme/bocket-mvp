let indexController = {

    index : function(req, res) {
        return res.render("index", {
            beta: 'on'
        });
    },

};

module.exports = indexController;