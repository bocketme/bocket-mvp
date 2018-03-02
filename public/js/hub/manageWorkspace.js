$(document).ready(function () {
  const manageWorkspaceBtn = $("#manage-workspace-btn");
  const manageWorkspaceClose = $("#manage-workspace-close");
  const manageWorkspaceDiv = $("#manage-workspace");
  const secondColumn = $("#second_column");
  const thirdColumn = $("#third_column");
  const manageWorkspaceError = $("#manage-workspace-error");

  const visibility = "visibility";
  const hidden = "hidden";

  /**
   * Toggle the manageWorkspace div
   */
  function togglemanageWorkspace() {
    secondColumn.toggle();
    thirdColumn.toggle();
    manageWorkspaceDiv.find('input').val("");
    manageWorkspaceError.css(visibility, hidden);
    manageWorkspaceDiv.toggle();
  }

  //togglemanageWorkspace();
  manageWorkspaceBtn.on('click', togglemanageWorkspace);
});
