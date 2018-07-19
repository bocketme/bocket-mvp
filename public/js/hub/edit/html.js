const editInfoRender = (id, title, description) =>
  (`
  <div editNode="${id}" id="edit-id-information">
    <div>
      <div class="input-field col s8 offset-s2">
          <input id="edit-node-title" value="${title}" type="text" class="validate">
          <label for="edit-node-title">Title</label>
      </div>
      <div class="input-field col s12">
        <textarea value="${description}" id="edit-node-description" class="materialize-textarea"></textarea>
        <label for="edit-node-description">Description</label>
      </div>
    </div>
  </div>
  `);

const option3D =
  (selected) => `<option value="${MODELES3D_FILES}" ${selected ? "selected" : ""}>Option 1</option>`;
const optionTexture =
  (selected) => `<option value="${TEXTURE_FILES}" ${selected ? "selected" : ""}>Option 2</option>`
const optionSpecFile =
  (selected) => `<option value="${SPECIFICATION_FILES}" ${selected ? "selected" : ""}>Option 3</option>`

const editFileRender = (id, name, extname, type) =>
  (`
  <div class="col s12" id="edit-id-${id}">
    ${name}
    <div class="input-field inline">
      <select class="edit-node-files"  editNode="${id}">
        ${extensions3d.include(extname) ? option3D(type === MODELES3D_FILES) : ""}
        ${extensionsTextures.include(extname) ? optionTexture(type === TEXTURE_FILES) : ""}
        ${optionSpecFile(type === SPECIFICATION_FILES)}
      </select> 
      <label>File Type</label>
    </div>
  </div> 
  `);

const addFile = (id) => `<input style="display:none" type="file" id="file-${id}">`;

const editWorkerRender = (id, userId, name, workHere) =>
  (`
  <div class="col s12" id="edit-id-${id}">
    <div class="row">
      <img src="/user/${userId}/image">
      ${name}
      <input initial="${workHere}" editNode="${id}" user-id="${userId}" initialState="${workHere === true}" type="checkbox" class="user-node" id="${userId}-workhere" ${workHere ? `checked="checked"` : ''} />
    </div>  
  </div>  
  `)
