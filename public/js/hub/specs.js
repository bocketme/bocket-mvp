let li = null;
$(document).ready(function() {

  let specs = $("#specs");
  const uploader = $("#specs-uploader");

  specs.on("contextmenu", function (e) {
    pointedElem = e.target;
    toggleMenuContextOff("#spec-context-menu");
    toggleMenuContextOn("#specs-context-menu");
    return false;
  });

  let downloadButton = $("#download");

  specs.on("contextmenu", "li", function (e) {
    pointedElem = e.target;
    li = $(this);
    downloadButton.attr('href', '/download/'+ idOfchoosenNode + '/' + li.attr("filename"));
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
    for (let i = 0 ; i < this.files.length ; i++) {
      const file = this.files[i];
      const splittedName = file.name.split('.');
      let uploadIds = fileUploader.upload(document.getElementById('specs-uploader'), {
        data: {
          nodeId: idOfchoosenNode
        }
      });
    }
  });

  let specsContextMenu = $("#specs-context-menu");
  let specContextMenu = $("#spec-context-menu");

  specsContextMenu.on("click", "#new_file", function (){
    $("#specs-uploader").click();
    console.log("New file");
  });

  specContextMenu.on("click", "#remove", function (){
    console.log('Remove');
    socket.emit("removeSpec", { nodeId: idOfchoosenNode, filename: $(pointedElem).closest('li').attr('filename') })
    toggleMenuContextOff("#spec-context-menu");
  });

  specContextMenu.on("click", "#preview", function (){
    console.log("Preview");
  });

  specContextMenu.on("click", "#rename", function (){
    toggleMenuContextOff("#spec-context-menu");
    let nameSpan = li.find('span').first();
    let formatSpan = li.find('span').last();
    let lastName = nameSpan.text() + '.' + formatSpan.text().toLowerCase();

    console.log(nameSpan, nameSpan.value, nameSpan.text());

    let input = $('<input/>', {
      type: 'text',
      value: $(nameSpan).text(),
      class: 'col s10 file-title'
    });

    let renameIt = (elem) => {
      nameSpan.text(elem.val());
      elem.remove();
      nameSpan.show();
      socket.emit('renameSpec', {nodeId: idOfchoosenNode, lastName, currentName: nameSpan.text() + '.' + formatSpan.text().toLowerCase()});
    };

    input.keydown(function (e) {
      console.log(e.which);
      if (e.which === 13 && $(this).val() !== '') {
        renameIt($(this));
      }
    });

    input.on('blur', function () {
      renameIt($(this));
    });
    nameSpan.hide();
    $(pointedElem).after(input);
    input.select();
    console.log("Rename");
  });

  specContextMenu.on("click", "#download", function (){
    console.log("Download: ", idOfchoosenNode, $(pointedElem).closest("li").attr("filename"));
  });

  socket.on("removeSpec", function (data) {
    if (idOfchoosenNode === data.nodeId) {
      console.log("removeSpec = ", data);
      $("#specs").find("li.collection-item[filename='" + data.filename + "']").remove();
    }
  });

  socket.on("renameSpec", function (data) {
    if (idOfchoosenNode === data.nodeId) {
      li.attr("filename", data.filename);
    }
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
