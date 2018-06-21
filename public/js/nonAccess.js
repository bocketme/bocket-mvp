$(document).ready(function () {
  const organizationDeleted = $('#organization-deleted'),
    organizationRemoved = $('#organization-removed'),
    workspaceDeleted = $('#workspace-deleted'),
    workspaceRemoved = $('#workspace-removed'),
    createOrganization = $('#create-organization');

  const forcedCreateOrganization = $('#forced-create-organization');

  forcedCreateOrganization.modal({
    dismissible: false,
    opacity: .9,
    inDuration: 300,
    outDuration: 200,
  });

  const optionsModal = {
    dismissible: false,
    opacity: .9,
    inDuration: 300,
    outDuration: 200,
    ready: function (modal, trigger) {
      const child = $(modal).find(".membership-user");
      const forcedReturn = $('.forced-return');
      forcedReturn.attr("href", `#${$(modal).attr("id")}`);
      const membershipReq = new XMLHttpRequest();
      membershipReq.open('GET', '/user/membership');
      membershipReq.send();
      membershipReq.onreadystatechange = function (event) {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            child.html(this.response);
            $('.collapsible').collapsible();
          } else {
            child.html('<p>Cannot Find the current user</p>');
          }
        }
      }
    }
  };

  organizationDeleted.modal(optionsModal);
  organizationRemoved.modal(optionsModal);
  workspaceDeleted.modal(optionsModal);
  workspaceRemoved.modal(optionsModal);
});

