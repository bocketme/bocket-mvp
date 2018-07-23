let EditRequest = [];

function EditReducer(id, cible, action) {
  console.log(id, cible, action);
  const newRequest = new XMLHttpRequest();

  const _this = this;

  EditRequest.push(newRequest);

  const i = EditRequest[EditRequest.length - 1];

  const { nodeId, cibledFile, file, userId } = cible

  newRequest.onreadystatechange = function (event) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        _this.changeStatus(id, 0);
      } else {
        _this.changeStatus(id, -1);
      }
      EditRequest = EditRequest.filter((v, index) => i !== index);
      this.inform();
    }
  }

  switch (action) {

    case CHANGE_INFORMATION:
      $.post(`/node/${nodeId}/changeInfo`, {
        "name": $("#edit-node-title").val(),
        "description": $("#edit-node-description").val()
      })
        .done(() => _this.changeStatus(id, 0))
        .fail(() => _this.changeStatus(id, -1));
      break;

    case TRANSFERT_3D_TO_SPEC:
      newRequest.open("PUT", `/node/${nodeId}/changeEmplacementFile/${cibledFile}/3DToSpec`);
      newRequest.send();
      break;

    case TRANSFERT_SPEC_TO_3D:
      newRequest.open("PUT", `/node/${nodeId}/changeEmplacementFile/${cibledFile}/SpecTo3D`);
      newRequest.send();
      break;

    case LAUNCH_CONVERSION:
      newRequest.open("PUT", `/node/${nodeId}/convert`);
      newRequest.send();
      break;

    case ADD_SPEC:
      newRequest.open("POST", `/node/${nodeId}/Spec`);
      newRequest.send(file);
      break;

    case ADD_3DFILE:
      newRequest.open("POST", `/node/${nodeId}/3D`);
      newRequest.send(file);
      break;

    case ADD_TEXTURE:
      newRequest.open("POST", `/node/${nodeId}/Texture`);
      newRequest.send(file);
      break;

    case REMOVE_SPEC:
      newRequest.open("DELETE", `/node/${nodeId}/spec/${cibledFile}`);
      newRequest.send();
      break;

    case REMOVE_3D:
      newRequest.open("DELETE", `/node/${nodeId}/3D`);
      newRequest.send();
      break;

    case REMOVE_TEXTURE:
      newRequest.open("DELETE", `/node/${nodeId}/Texture/${cibledFile}`);
      newRequest.send();
      break;

    case ADD_ACCESS:
      newRequest.open("POST", `/node/${nodeId}/access/${userId}`);
      newRequest.send();
      break;

    case REMOVE_ACCESS:
      newRequest.open("DELETE", `/node/${nodeId}/access/${userId}`);
      newRequest.send(form);
      break;
  }
}
