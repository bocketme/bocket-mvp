$(document).ready(function() {
    $("#specs").on("contextmenu", function (e) {
            toggleMenuContextOn("#specs-context-menu");
            return false;
        })
});

/**
 *
 * @param lastSpec : JQuery on lastComment
 * @param file : {name : string, format :  string}
 */
function addSpec(lastSpec, file) {
    lastSpec.after("" +
        "<div class=\"row\">\n" +
        "    <div class=\"col s12\">\n" +
        "        <div class=\"col s1\"><img src=\"/img/file-icon.svg\"></div>\n" +
        "        <span class=\"col s10 file-title\">" + file.name + "</span>\n" +
        "        <span class=\"col s1 format\">" + file.format + "</span>\n" +
        "    </div>\n" +
        "</div>\n");
}
