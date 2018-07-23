const getEditModalContent = new XMLHttpRequest();
let store;
$(document).ready(() => {

  getEditModalContent.onreadystatechange = function (event) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const { info, files, workers, typeofNode } = JSON.parse(this.response);
        console.log(typeofNode);
        store = new EditStore(info, files, workers, idOfchoosenNode, typeofNode);
      } else {
        Materialize.toast('Cannot Find the Node'),
          $("#edit-node").modal('close');
      }
    }
  }

  $("#edit-node").modal({
    ready: function (modal, trigger) {
      if ($(trigger).hasClass("edit-part-btn")) {
        getEditModalContent.open('GET', `/node/${idOfchoosenNode}/information`);
        getEditModalContent.send();
      }
    }
  });


  //Stack CHANGE_INFORMATION
  $(document).on(
    'input',
    '#edit-node-title , #edit-node-description',
    function (event) {
      if (store instanceof EditStore) { store.changeInfo(); }
    }
  );

  //Evenements pour modifier l'accès au utilisateur (alpha)
  $(document).on("change", ".user-node", function () {
    const id = $(this).attr('editNode');
    if (store instanceof EditStore) {
      store.workingHere();
    }
  })

  //Evenements pour delete un fichier
  $(document).on("click", ".edit-node-file-close", function (event) {
    if (!store instanceof EditStore) return;

    const element = $(this);
    const parent = element.parent();
    const p = parent.find("p");
    const select = parent.parent().find("select");
    const id = Number(parent.attr("editNode"));

    if (element.hasClass("active")) {

      element.removeClass("active");
      p.removeClass("barre");
      select.prop("disabled", false)
      select.material_select();
      store.addFile(id);

    } else {

      element.addClass("active");
      p.addClass("barre");
      select.prop("disabled", true);
      select.material_select()
      store.removeFile(id);

    }
  })

  //Evenements pour ajouter un fichier 
  $(document).on("click", "#AddFile", function (event) {
    $("#edit-node-files-selection").trigger("click");
  });

  $(document).on("change", "#edit-node-files-selection", function (event) {
    const Files = [...document.getElementById('edit-node-files-selection').files];
    Files.forEach(file => store.addFile(file));
  });

  $(document).on('click', "#edit-save", function (event) {
    store.save();
  });

  $(document).on("click", "#edit-cancel", function (event) {
    let generalState = store.inform();
    $("#edit-node").modal('close');
    if (generalState)
      $("#exit-edit-modal").modal('open');
  });

  $(document).on("click", "#edit-delete", function (event) {
    $("#edit-node").modal('close');
    $("#edit-delete-modal").modal('open');
  });

  $(document).on("click", "#edit-delete-confirm", function (event) {
    if (store instanceof EditStore)
      socket.emit('[Node] - Delete', store._nodeId);
    $("#edit-delete-modal").modal('close');
  });

  //
  $(document).on('change', '.edit-node-files', function (event) {
    if (!store instanceof EditStore)
      return null;

    const id = Number($(this).parents(".edit-node-file-unique").attr("editNode"));
    const value = $(this).val();

    store.tranfertFile(id, value);
  });

  $(document).on('change', ".user-node", function (event) {
    if (!store instanceof EditStore) return null;

    const id = $(this).attr('editNode');
    const checked = $(this).prop("checked");
    if (checked) store.editWorker(id, checked);
    else store.removeWorker(id, checked);
  })

});
