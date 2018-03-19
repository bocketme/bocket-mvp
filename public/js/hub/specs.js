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

  $("#specs-collection").on('contextmenu', '.collection-item-files',function (e) {
    pointedElem = e.target;
    li = $(this);
    downloadButton.attr('href', '/download/'+ idOfchoosenNode + '/' + li.attr("filename"));
    toggleMenuContextOff("#specs-context-menu");
    $(e.currentTarget).trigger( 'click' );
    if(li.is('#native'))
      toggleMenuContextOn("#native-files");
    else
      toggleMenuContextOn("#spec-context-menu");
    return false;
  });

  socket.on("addSpec", function (fileName, native) {
    addSpec($("#specs-collection"),
      {
        name: fileName.slice(0, (Math.max(0, fileName.lastIndexOf(".")) || Infinity)),
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
    console.log($(pointedElem).closest('li').attr('filename'));
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
    let icon = li.find('#file-name');
    let nameSpan = li.find('span').first();
    let formatSpan = li.find('span').last();
    let lastName = nameSpan.text() + '.' + formatSpan.text().toLowerCase();

    console.log(icon);
    icon.hide();

    let input = $('<input/>', {
      type: 'text',
      value: $(nameSpan).text(),
      class: 'col s10 file-title'
    });

    let renameIt = (elem) => {
      nameSpan.text(elem.val());
      icon.hide();      
      elem.remove();
      nameSpan.show();
      socket.emit('renameSpec', {nodeId: idOfchoosenNode, lastName, currentName: nameSpan.text().trim() + '.' + formatSpan.text().toLowerCase().trim()});
    };

    input.keydown(function (e) {
      console.log(e.which);
      if (e.which === 13 && $(this).val() !== '') {
        renameIt($(this));
      }
    });

    input.on('blur', function () {
      icon.hide();
      renameIt($(this));
    });
    nameSpan.hide();
    icon.show();
    $(pointedElem).after(input);
    input.select();
  });

  specContextMenu.on("click", "#download", function (){
    console.log("Download: ", idOfchoosenNode, $(pointedElem).closest("li").attr("filename"));
  });

  socket.on("removeSpec", function (data) {
    if (idOfchoosenNode === data.nodeId) {
      $('#specs-collection').find("[filename*='"+data.filename+"']").remove();
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
  console.log(file);
  if (native) {
    let buttonNativeDownload = $('#download-native');
    native_icon = "<img src='/img/native-3d-file.png' class='native_icon specs'>";
    buttonNativeDownload.attr('href', `/download/${idOfchoosenNode}/native/${file.name}.${file.format}`);
  }
  console.log(`${file.name}.${file.format}`);
  ul.append(`<li class="collection-item-files specs" ${native?'id="native"':''}" filename="${file.name}.${file.format}">` +
    `<p class="truncate specs">`+
    `<span class="specs-span text-file-style"><i id="file-name" class="specs material-icons tiny">insert_drive_file</i>`+
    `${file.name}</span>`+
    `<span class="specs secondary-content format">${native_icon} ${file.format.toUpperCase()}</span></p>` +
    `</li>`);
}