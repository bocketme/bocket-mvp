/**
 *
 *
 * @param {Object} data
 * @param {String} data.nodeId The Id of the Node
 * @param {String} data.cibledFile The file that will have a modification 
 * @param {String} data.userId The Id of the User
 * @param {FormData} data.form The Form
 * @param {string} action
 * @param {Function} onDone
 * @param {Function} onError
 */
function EditReducer(data, action, onDone, onError) {
    const EditRequest = new XMLHttpRequest();
    const { nodeId, cibledFile, userId, form } = data

    EditRequest.onreadystatechange = function(event) {
        if (this.readyState === 4) {
            if (this.status === 200) onDone();
            else onError();
        }
    }

    switch (action) {
        case CHANGE_INFORMATION:
            EditRequest.open("UPDATE", `/node/${nodeId}/changeInfo`);
            EditRequest.send();
            break;
        case TRANSFERT_3D_TO_SPEC:
            EditRequest.open("UPDATE", `/node/${nodeId}/changeEmplacementFile/${cibledFile}/ToSpec`);
            EditRequest.send();
            break;
        case TRANSFERT_SPEC_TO_3D:
            EditRequest.open("UPDATE", `/node/${nodeId}/changeEmplacementFile/${cibledFile}/To3D`);
            EditRequest.send();
            break;
        case LAUNCH_CONVERSION:
            EditRequest.open("UPDATE", `/node/${nodeId}/convert`);
            EditRequest.send();
            break;
        case ADD_SPEC:
            EditRequest.open("POST", `/node/${nodeId}/Spec`);
            EditRequest.send();
            break;
        case ADD_3DFILE:
            EditRequest.open("POST", `/node/${nodeId}/3D`);
            EditRequest.send(form);
            break;
        case ADD_TEXTURE:
        const form = ;
            EditRequest.open("POST", `/node/${nodeId}/Texture`);
            EditRequest.send(form);
            break;
        case REMOVE_SPEC:
            EditRequest.open("DELETE", `/node/${nodeId}/spec/${cibledFile}`);
            EditRequest.send();
            break;
        case REMOVE_3D:
            EditRequest.open("DELETE", `/node/${nodeId}/3D`);
            EditRequest.send();
            break;
        case REMOVE_TEXTURE:
            EditRequest.open("DELETE", `/node/${nodeId}/Texture/${cibledFile}`);
            EditRequest.send();
            break;
        case ADD_ACCESS:
            EditRequest.open("POST", `/node/${nodeId}/access/${userId}`);
            EditRequest.send();
            break;
        case REMOVE_ACCESS:
            EditRequest.open("REMOVE", `/node/${nodeId}/access/${userId}`);
            EditRequest.send(data);
            break;
    }
}
