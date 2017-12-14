$(document).ready(function() {
    var specs = $("#specs");

    specs.on("contextmenu", function (e) {
            toggleMenuContextOn("#specs-context-menu");
            return false;
        })

    var contextMenu = $("#specs-context-menu");

    $("#specs-context-menu #new_file").on("click", function (){
        addSpec($("#specs-collection").find("li:last-child"), {name: "Image", format: 'PNG'});
        console.log("New file");
    });

    contextMenu.find("#remove").on("click", function (){
        console.log("Remove");
        $(pointedElem).closest("li").remove();
    });

    contextMenu.find("#preview").on("click", function (){
        console.log("Preview");
    });

    contextMenu.find("#rename").on("click", function (){
        console.log("Rename");
    });

    contextMenu.find("#download").on("click", function (){
        console.log("Download");
    });
});

/**
 *
 * @param lastSpec : JQuery on lastComment
 * @param file : {{name : string, format :  string}}
 */
function addSpec(lastSpec, file) {
    lastSpec.after("" +
        "<li class=\"collection-item\">" +
            "<div class=\"row\">\n" +
            "    <div class=\"col s12\">\n" +
            "        <div class=\"col s1\"><img src=\"/img/file-icon.svg\"></div>\n" +
            "        <span class=\"col s10 file-title\">" + file.name + "</span>\n" +
            "        <span class=\"col s1 format\">" + file.format + "</span>\n" +
            "    </div>\n" +
            "</div>\n" +
        "</li>");
}
