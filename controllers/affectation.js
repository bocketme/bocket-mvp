var affectation = {
    list_by_project: (req, res) => {
        var id_project = req.params.project;
    },
    list_by_organization: (req, res) => {
        var id_organization = req.params.organization;
    }
};

module.exports = affectation;