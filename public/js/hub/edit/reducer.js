let EditRequest = [];

function handleNewsfeed(name, user, id, type) {
  const nodeType = ($(`${id}-body`).length ? 'ASSEMBLY' : 'PART');
  if (!nodeType)
    return;
  switch (type) {
    default:
      break;

    case CHANGE_INFORMATION:
      $('#news-feed').trigger('addNews', [nodeType, 'DETAILS', { _id: id, name }, '']);
      break;

    case ADD_SPEC:
      $('#news-feed').trigger('addNews', [nodeType, 'DOC-ADD', { _id: id, name }, '']);
      break;

    case ADD_3DFILE:
      $('#news-feed').trigger('addNews', [nodeType, 'FILE3D-ADD', { _id: id, name }, '']);
      break;

    case ADD_TEXTURE:
      $('#news-feed').trigger('addNews', [nodeType, 'DOC-ADD', { _id: id, name }, '']);
      break;

    case REMOVE_SPEC:
      $('#news-feed').trigger('addNews', [nodeType, 'DOC-DEL', { _id: id, name }, '']);
      break;

    case REMOVE_TEXTURE:
      $('#news-feed').trigger('addNews', [nodeType, 'DOC-DEL', { _id: id, name }, '']);
      break;

    case REMOVE_3D:
      $('#news-feed').trigger('addNews', [nodeType, 'FILE3D-DEL', { _id: id, name }, '']);
      break;
  }
}

function EditReducer(id, cible, action) {
  const newRequest = new XMLHttpRequest();
  const _this = this;

  let options;

  EditRequest.push(newRequest);

  const i = EditRequest[EditRequest.length - 1];

  const {
    nodeId, cibledFile, file, userId,
  } = cible;

  newRequest.onreadystatechange = function (event) {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const { name, user, _id } = this.response;
        handleNewsfeed(name, user, _id, action);
        _this.finished(id);
      } else
        _this.error(id);

      EditRequest = EditRequest.filter((v, index) => i !== index);
    }
  };

  switch (action) {
    default:
      _this.changes--;
      _this.verify();
      break;

    case CHANGE_INFORMATION:
      const name = $('#edit-node-name').val(),
            description = $('#edit-node-description').val();
      const sendData = JSON.stringify({ name, description });
      options = {
        url: `/node/${nodeId}/changeInfo`,
        data: sendData,
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        success: (d) => {
          handleNewsfeed(d.name, d.user, d._id, CHANGE_INFORMATION);
        },
      };
      $.ajax(options)
        .done(() => { _this.finished(id); })
        .fail(() => { _this.error(id); });
      break;

    case TRANSFERT_3D_TO_SPEC:
      _this.launchConvert = true;
      newRequest.open('PUT', `/node/${nodeId}/changeEmplacementFile/${cibledFile}/3DToSpec`);
      newRequest.send();
      break;

    case TRANSFERT_SPEC_TO_3D:
      _this.launchConvert = true;
      newRequest.open('PUT', `/node/${nodeId}/changeEmplacementFile/${cibledFile}/SpecTo3D`);
      newRequest.send();
      break;

    case LAUNCH_CONVERSION:
      newRequest.open('PUT', `/node/${nodeId}/convert`);
      newRequest.send();
      break;

    case ADD_SPEC:
      options = {
        url: `/node/${nodeId}/Spec`,
        data: file,
        type: 'POST',
        contentType: false,
        processData: false,
        success: (d) => {
          handleNewsfeed(d.name, d.user, d._id, ADD_SPEC);
        },
      };
      $.ajax(options)
        .done(() => { _this.finished(id); })
        .fail(() => { _this.error(id); });
      break;

    case ADD_3DFILE:
      _this.launchConvert = true;
      options = {
        url: `/node/${nodeId}/3D`,
        data: file,
        type: 'POST',
        contentType: false,
        processData: false,
        success: (d) => {
          handleNewsfeed(d.name, d.user, d._id, ADD_3DFILE);
        },
      };
      $.ajax(options)
        .done(() => { _this.finished(id); })
        .fail(() => { _this.error(id); });
      break;

    case ADD_TEXTURE:
      _this.launchConvert = true;
      options = {
        url: `/node/${nodeId}/Texture`,
        data: file,
        type: 'POST',
        contentType: false,
        processData: false,
        success: (d) => {
          handleNewsfeed(d.name, d.user, d._id, ADD_TEXTURE);
        },
      };
      $.ajax(options)
        .done(() => { _this.finished(id); })
        .fail(() => { _this.error(id); });
      break;

    case REMOVE_SPEC:
      newRequest.open('DELETE', `/node/${nodeId}/spec/${cibledFile}`);
      newRequest.send();
      break;

    case REMOVE_TEXTURE:
      _this.launchConvert = true;
      newRequest.open('DELETE', `/node/${nodeId}/Texture/${cibledFile}`);
      newRequest.send();
      break;

    case REMOVE_3D:
      _this.launchConvert = true;
      newRequest.open('DELETE', `/node/${nodeId}/3D/${cibledFile}`);
      newRequest.send();
      break;

    case ADD_ACCESS:
      newRequest.open('POST', `/node/${nodeId}/access/${userId}`);
      newRequest.send();
      break;

    case REMOVE_ACCESS:
      newRequest.open('DELETE', `/node/${nodeId}/access/${userId}`);
      newRequest.send();
      break;
  }
}
