const deleteFromWorkspace = (rights, isProductManager) => {
  if (rights>4 || isProductManager) {
    $('#').modal('open')
  } else
    Materialize.Toast('You have no rights to delete the organization');
};

const leaveWorkspace = (rights, isProductManager) => {
  $('#').modal('open');
};