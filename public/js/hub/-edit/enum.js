const CHANGE_INFORMATION = "CHANGE_INFORMATION";
const TRANSFERT_3D_TO_SPEC = "TRANSFERT_3D_TO_SPEC";
const TRANSFERT_SPEC_TO_3D = "TRANSFERT_SPEC_TO_3D";
const LAUNCH_CONVERSION = "LAUNCH_CONVERSION";
const ADD_SPEC = "ADD_SPEC";
const ADD_3DFILE = "ADD_3DFILE";
const ADD_TEXTURE = "ADD_TEXTURE";
const REMOVE_SPEC = "REMOVE_SPEC";
const REMOVE_3D = "REMOVE_3D";
const REMOVE_TEXTURE = "REMOVE_TEXTURE";
const ADD_ACCESS = "ADD_ACCESS";
const REMOVE_ACCESS = "REMOVE_ACCESS";
const DISABLED = "DISABLED";

const EDIT_NODE = {
  ID: {
    MODAL: document.getElementById("edit-node-modal"),
    CONTENT: document.getElementById("edit-node-content"),
    NAME: document.getElementById("edit-node-name"),
    DESCRIPTION: document.getElementById("edit-node-description"),
    TITLE: document.getElementById("edit-node-title"),
    ERROR: document.getElementById("edit-node-error"),
    ADD_FILE: document.getElementById("edit-node-add-file"),
    CANCEL: document.getElementById("edit-node-cancel"),
    SAVE: document.getElementById("edit-node-save"),
  },
  CLASS: {
    TYPE_FILE: document.getElementsByClassName("edit-node-information"),
    USER: document.getElementsByClassName("edit-node-user"),
    USER_IS_ATTRIBUTED: document.getElementsByClassName("edit-node-user-checkbox"),
  }
}
