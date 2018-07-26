const NO_CHANGEMENT = 0
const CHANGE_INFORMATION = 1;

const ADD_3DFILE = 2.1;
const ADD_TEXTURE = 2.2;
const ADD_SPEC = 2.3;

const TRANSFERT_3D_TO_SPEC = 3.1;
const TRANSFERT_SPEC_TO_3D = 3.2;
const TRANSFERT_TEXTURE_TO_SPEC = TRANSFERT_3D_TO_SPEC; //For the server, it's the same thing
const TRANSFERT_SPEC_TO_TEXTURE = TRANSFERT_SPEC_TO_3D; //For the server, it's the same thing
const LAUNCH_CONVERSION = 3.5;

const REMOVE_3D = 4.1;
const REMOVE_TEXTURE = 4.2;
const REMOVE_SPEC = 4.3;

const ADD_ACCESS = 5.1;
const REMOVE_ACCESS = 5.2;

const MODELES3D_FILES = "MODELES_3D_FILES";
const TEXTURE_FILES = "TEXTURE_FILES"
const SPECIFICATION_FILES = "SPECIFICATION";

const convertRequest = new XMLHttpRequest();

convertRequest.onreadystatechange = function () {
  if (this.readyState === this.DONE) {
    if (this.status === 200) {
      //Update the Viewer
      document.("[Viewer] - remove", { nodeId: idOfChoosenNode })
      socket.emit("", idOfChoosenNode);
    }
  }
}
