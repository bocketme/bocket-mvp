$(document).ready(function() {

    var specs = $("#specs");
    const uploader = $("#specs-uploader");

    specs.on("contextmenu", function (e) {
            toggleMenuContextOn("#specs-context-menu");
            return false;
    });

    uploader.on('change', function() {
        for (var i = 0 ; i < this.files.length ; i++) {
          const file = this.files[i];
          const splittedName = file.name.split('.');
          addSpec($("#specs-collection").find("li:last-child"), {name: splittedName[0], format: splittedName[1]});
          var uploadIds = fileUploader.upload(file);
        }
    });

    var contextMenu = $("#specs-context-menu");

    $("#specs-context-menu #new_file").on("click", function (){
        $("#specs-uploader").click();
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
