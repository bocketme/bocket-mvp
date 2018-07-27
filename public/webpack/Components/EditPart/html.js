//Feedback Message
export const isValid = '<i class="material-icons right"></i>';
export const isNotValid = '<i class="material-icons right"></i>';

/**
 * Returns an html string with an error Message
 * @param {string} message
 */
export const hasanError = (message) => `<p class="edit-error">${message}</p>`;


/**
 * How to add a file, add 5 files
 *
 * @param {string} id
 * @param {string} name
 * @param {string} type 
 * @param {Object} avaibleType The avaible type with what you can change your 3D
 * @param {boolean} avaibleType.modele 
 * @param {boolean} avaibleType.texture
 * @param {boolean} avaibleType.spec
 */
export const addFile = (id, name, type, { modele, texture, spec }) => `<div class="col s12" editNode="${id}">
  <i class="material-icons">delete</i>
  ${name}
  <div class="input-field inline">
  <select>
  ${modele ? `<option value="3" ${type === 3 ? "selected" : ""}>File 3D</option>` : ""}
  ${texture ? `<option value="4" ${type === 4 ? "selected" : ""}>Textures</option>` : ""}
  ${spec ? `<option value="5" ${type === 5 ? "selected" : ""}>Spécification</option>` : ""}
  </select>
  </div>
</div>`

/**
 * Render an new user champ in html
 *
 * @param {string} id
 * @param {string} completeName
 * @param {string} workHere
 */
export const addUser = (id, completeName, workHere) => `<div class="col s12">
  <i class=""></i>
  ${completeName}
  <div class="input-field inline">
    <input type="checkbox" userId="${id}" ${workHere ? `checked="checked"` : ""} id="${}"/>
  ${workHere}"
  </div>
</div>`
