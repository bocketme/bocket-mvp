const getEditModalContent = new XMLHttpRequest();

$().modal({
  ready: function (modal, trigger) {
    if (trigger === trigger1 || trigger === trigger2) {
      getEditModalContent.open('GET', ``);
      getEditModalContent.send();
    }
  }
});

getEditModalContent.onreadystatechange = function (event) {
  if (this.readyState === 4) {
    const content = EDIT_NODE.ID.CONTENT;
    if (this.status === 200)
      content.innerHTML = this.response;
    else
      content.innerHTML = "Cannot charge this module, please try again"
  }
}

//Stack CHANGE_INFORMATION
$(document).on('input', '#edit-name-node , #edit-description-node', function (event) {

});

$(document).on('change', '.files-node', function (event) {

//Stack TRANSFERT_3D_TO_SPEC

//Stack TRANSFERT_SPEC_TO_3D

//Stack TRANSFERT_S

//Stack LAUNCH_CONVERSION


});

//Stack ADD_SPEC
$(document).on('click', '', function (event) {

});

//Stack ADD_3DFILE
$(document).on('click', '', function (event) {

});

//Stack ADD_TEXTURE
$(document).on('click', '', function (event) {

});

//Stack REMOVE_SPEC
$(document).on('click', '', function (event) {

});

//Stack REMOVE_3D
$(document).on('click', '', function (event) {

});

//Stack REMOVE_TEXTURE
$(document).on('click', '', function (event) {

});

//Stack ADD_ACCESS
$(document).on('click', '', function (event) {

});

//Stack REMOVE_ACCESS
$(document).on('click', '', function (event) {

});
