const { renderString, renderTemplateFile } = require("template-file"),
    fs = require("fs"),
    path = require("path"),
    promisify_writefile = require("./promise_write_file");

var write_template = (uuid, original_name, template_name, filename, path) => {
    let data = {
            filename: filename,
            uuid: uuid,
            original_name: original_name,
        },
        template_path = path.join('template', template_name);
    renderTemplateFile(template_path, data)
        .then(renderedString => promisify_writefile(path, renderedString));
};

module.exports = write_template;