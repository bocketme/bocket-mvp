const getEditModalContent = new XMLHttpRequest();
let store;

$("#edit-node").modal({
  ready: function (modal, trigger) {
    if (trigger === trigger1 || trigger === trigger2) {
      getEditModalContent.open('GET', `/node/${nodeId}/information`);
      getEditModalContent.send();
    }
  }
});

getEditModalContent.onreadystatechange = function (event) {
  if (this.readyState === 4) {
    if (this.status === 200) {
      const { info, files, workers } = this.response;
      store = new EditStore(info, files, workers);
    } else {
      Materialize.toast('Cannot Find the Node'),
        $("#edit-node").modal('close');
    }
  }
}

//Stack CHANGE_INFORMATION
$(document).on(
  'input',
  '#edit-node-title , #edit-node-description',
  function (event) {
    if (store instanceof EditStore) {
      store.changeInfo();
    }
  }
);

//Evenements pour modifier l'accès au utilisateur (alpha)
$(document).on("change", ".user-node", function () {
  const id = $(this).props('editNode');
  if (store instanceof EditStore) {
    store.workingHere();
  }
})

//Evenements pour delete un fichier
$(document).on("click", ".edit-node-file-close", function (event) {
  const id = $(this);

})

//Evenements pour ajouter un fichier 
$(document).on("click", "#AddFile", function (event) {

  $("#edit-node-files-selection").trigger();

});

$(document).on("change", "#edit-node-files-selection", function (event) {
  const Files = $(this).files
  if (Files.length > 0 && store instanceof EditStore) {
    for (let i = 0; i > Files.length; i++) {
      store.addFile();
    }
  };
});

//
$(document).on('change', '.edit-node-files', function (event) {
  const id = $(this);

  //Stack TRANSFERT_3D_TO_SPEC

  //Stack TRANSFERT_SPEC_TO_3D

  //Stack TRANSFERT_S

  //Stack LAUNCH_CONVERSION


});
