$(document).ready(function() {
  let specs = $("#specs");
  let li = null;
  const uploader = $("#specs-uploader");

  /*
  specs.on("contextmenu", function (e) {
    pointedElem = e.target;
    toggleMenuContextOff("#spec-context-menu");
    toggleMenuContextOn("#specs-context-menu");
    return false;
  });
  */


  let downloadButton = $("#download");

  specs.on("contextmenu", "li", function (e) {
    pointedElem = e.target;
    li = $(this);
    downloadButton.attr('href', '/download/'+ idOfchoosenNode + '/' + li.attr("filename"));
    toggleMenuContextOff("#specs-context-menu");
    toggleMenuContextOn("#spec-context-menu");
    return false;
  });

  socket.on("addSpec", function (fileName, native) {
    const splittedName = fileName.split('.');
    addSpec($("#specs-collection"),
      {
        name: splittedName[0],
        format: fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1)
      }, native);
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

  let specsContextMenu = $('#specs-context-menu');
  let specContextMenu = $('#spec-context-menu');

  specsContextMenu.on("click", "#new_file", function (){
    $("#specs-uploader").click();
  });

  specContextMenu.on("click", "#remove", function (){
    console.log('Remove');
    socket.emit("removeSpec", { nodeId: idOfchoosenNode, filename: $(pointedElem).closest('li').attr('filename') });
    toggleMenuContextOff("#spec-context-menu");
  });

  /*
  specContextMenu.on("click", "#preview", function (){
    console.log("Preview");
  });
  */

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
function addSpec(ul, file, native) {
  let native_icon = '';
  if (native)
    native_icon = "<img src='/img/native-3d-file.png' class='native_icon'>";
  ul.append(`<li class="collection-item-files" ${native?'id="native"':''}" filename="${file.name}.${file.format}">` +
    `<p class="truncate">`+
    `<i class="material-icons tiny">insert_drive_file</i>`+
    `${file.name}`+
    `<span class="secondary-content format">${native_icon} ${file.format.toUpperCase()}</span></p>` +
    `</li>`);
}