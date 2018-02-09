$(document).ready(function() {

    var specs = $("#specs");
    const uploader = $("#specs-uploader");

    var TEST = null;

    specs.on("contextmenu", function (e) {
      toggleMenuContextOff("#spec-context-menu");
      toggleMenuContextOn("#specs-context-menu");
      return false;
    });

  specs.on("contextmenu", "li", function (e) {
    toggleMenuContextOff("#specs-context-menu");
    toggleMenuContextOn("#spec-context-menu");
    return false;
  });

  socket.on("addSpec", function (fileName) {
      console.log("ADD SPEC");
      const splittedName = fileName.split('.');
      addSpec($("#specs-collection").find("li:last-child"), {name: splittedName[0], format: splittedName[1]});
    });

    $("#loadSpecs").on("click", function () {
      console.log("loadSpecs.onClick : ", idOfchoosenNode);
      socket.emit("getAllSpec", idOfchoosenNode);
    });

    uploader.on('change', function() {
        for (var i = 0 ; i < this.files.length ; i++) {
          const file = this.files[i];
          const splittedName = file.name.split('.');
          var uploadIds = fileUploader.upload(document.getElementById('specs-uploader'), {
            data: {
              nodeId: idOfchoosenNode
            }
          });
        }
    });

    var contextMenu = $("#specs-context-menu");

    contextMenu.on("click", "#new_file", function (){
        $("#specs-uploader").click();
      console.log("New file");
    });

    contextMenu.on("click", "#remove", function (){
        console.log("Remove");
        $(pointedElem).closest("li").remove();
    });

    contextMenu.on("click", "#preview", function (){
        console.log("Preview");
    });

    contextMenu.on("click", "#rename", function (){
        console.log("Rename");
    });

    contextMenu.on("click", "#download", function (){
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
        "<li class=\"collection-item\" filename='" + file.name + "." + file.format + "'>" +
            "<div class=\"row\">\n" +
            "    <div class=\"col s12\">\n" +
            "        <div class=\"col s1\"><img src=\"/img/file-icon.svg\"></div>\n" +
            "        <span class=\"col s10 file-title\">" + file.name + "</span>\n" +
            "        <span class=\"col s1 format\">" + file.format.toUpperCase() + "</span>\n" +
            "    </div>\n" +
            "</div>\n" +
        "</li>");
}
