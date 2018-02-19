$(document).ready(function() {
  let _new = "new";
  let search = "search";

  let organizationSelect = $('#organizationSelect');
  let organizationCreation = $('#newOrgnanizationName');

  let checkbox = $('#form-create-workspace :checkbox');

  let button = $("#creation-workspace-submit");

  organizationCreation.hide();

  checkbox.change(function() {
    organizationCreation.attr('value',null);
    if (this.checked) {

      organizationSelect.hide();
      organizationSelect.attr('disabled',true).removeClass('disabled');

      organizationCreation.show();
      organizationCreation.attr('disabled',false).toggleClass('disabled');
    } else {
      organizationSelect.show();
      organizationSelect.attr('disabled',false).toggleClass('disabled');

      organizationCreation.hide();
      organizationCreation.attr('disabled',true).removeClass('disabled');
    }
  });

  button.click(function (event) {
    event.preventDefault();

    let userId = user._id;

    let organization = ($('#workspaceCreation :checkbox').is(':checked')) ?
      {type: _new, name: $('#newOrgnanizationName').val()}  :
      {type: search, _id: $('#organizationSelect').val(), name: $('#organizationSelect option:selected').text()};

    if (organization.name === null){
      if (organization.type === _new)
        Materialize.toast("You must write the name of the new organization", 4000);
      else if (organization.type === search)
        Materialize.toast("You must select a valid organization", 4000);
      else
        Materialize.toast("Intern Error", 4000);
      return;
    }

    let workspace = $('#newWorkspaceName').val();

    socket.emit("hubNewWorkspace", userId, organization, workspace);
  });
});
