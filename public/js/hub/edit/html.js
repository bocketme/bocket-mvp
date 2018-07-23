const editInfoRender = (id, title, description) =>
  (`
  <div editNode="${id}" id="edit-id-information">
    <div>
      <div class="input-field col s4">
          <input placeholder="${title}" id="edit-node-title" value="${title}" type="text" class="validate">
          <label for="edit-node-title">Title</label>
      </div>
      <div class="input-field col s12">
        <textarea value="${description}" id="edit-node-description" class="materialize-textarea"></textarea>
        <label for="edit-node-description">Description</label>
      </div>
    </div>
  </div>
  `);

const _extension3D = extensions3d.map(ext => '.' + ext);
const _extensionsTextures = extensionsTextures.map(ext => '.' + ext);

const typeFile = (extname) => {
  if (_extension3D.includes(extname)) return MODELES3D_FILES;
  else if (_extensionsTextures.includes(extname)) return TEXTURE_FILES;
  else return SPECIFICATION_FILES;
}

const option3D =
  (selected) => `<option value="${MODELES3D_FILES}" ${selected ? "selected" : ""}>3d File</option>`;
const optionTexture =
  (selected) => `<option value="${TEXTURE_FILES}" ${selected ? "selected" : ""}>Texture file</option>`
const optionSpecFile =
  (selected) => `<option value="${SPECIFICATION_FILES}" ${selected ? "selected" : ""}>Spec File</option>`


const selectFileType = (id, extname, typeFile) => (`
  <div class="edit-node-file-unique input-field inline col s4" editNode="${id}">
    <select class="edit-node-files"  editNode="${id}">
      ${_extension3D.includes(extname) ? option3D(typeFile === MODELES3D_FILES) : ""}
      ${_extensionsTextures.includes(extname) ? optionTexture(typeFile === MODELES3D_FILES) : ""}
      ${optionSpecFile(typeFile === SPECIFICATION_FILES)}
    </select> 
    <label>File Type</label>
  </div>
  `);

const editFileRender = (id, name, extname, typeFile, typeNode) =>
  (`
  <div class="row">
    <div class="col s12 file-ensemble" id="edit-id-${id}">
     <div class="col s7 file-information" editNode="${id}" style="margin-top: 20px">
         <a id="deleteFile" class="left edit-node-file-close" href="#deletefile-${id}">
            <i class="material-icons"></i>
         </a> 
         <p class="truncate">${name}</p>
         <p class="text-error"></p>
      </div>
      ${ typeNode === "part" ? selectFileType(id, extname, typeFile) : ""}
      <div class="col s1 informStatus" editNode="${id}" style="margin-top: 20px">
      </div>
    </div> 
  </div>
    `);

const addFile = (id) => `< input style = "display:none" type = "file" id = "file-${id}" > `;

const editWorkerRender = (id, userId, name, workHere) =>
  (`
  <div class="col s12" id = "edit-id-${id}" >
    <div class="row">
      <div editNode="${id}" userId=${userId} class="profile col s2"></div>
      <div class="col s7">
        <p>${name}</p>
      </div>
      <div class="switch col s1">
        <label>
        <input editNode="${id}" type="checkbox" id="user-${id}" ${workHere ? `checked="checked"` : ''} class="user-node"  />
          <span class="lever"></span>
        </label>
      </div>
      <div class="col s1 informStatus" editNode="${id}">
      </div>
    </div>
  </div>
`)
