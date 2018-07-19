class EditStore {
  constructor (info, files, workers, nodeId) {
    this._id = 0;
    this.blocked = false;

    this.store = [];

    this._nodeId = nodeId;

    this._info = $("div#edit-info");
    this._file = $("div#edit-file");
    this._worker = $("div#edit-worker");

    this._info.html("");
    this._file.html("");
    this._worker.html("");

    this.reducer = EditReducer;

    this.initializeTitle(info.title, info.description);
    files.forEach(({ filename, extname, type }) => this.File(filename, extname, type));
    workers.forEach(({ userId, name, workHere }) => this.Worker(userId, name, workHere));
  }

  get getId() { return this._id; }

  set incrementId() { this._id++; }

  get retrieveStack(_id) {
    return this.store.find(({ id }) => id === _id);
  }

  set addStack(id, status, data = {}, initialState = null) {

    data.nodeId = this._nodeId;

    if (id && status)
      this.store = [...this.store, { id, status, data, initialState }];
  }

  set removeStack(_id) { this.store = this.store.filter(({ id }) => _id !== id); }

  set changeStatus(_id, _status) {
    this.store = this.store
      .map(store => store.id === _id ? { ...store, _status } : store);
  }

  initializeTitle(title, description) {
    this.incrementId();
    this._title = title;
    this._description = description;

    const id = this.getId();

    this.addStack(id, NO_CHANGEMENT);

    $("div#edit-indo").append(editInfoRender(id, title, description));
  }

  changeInfo() {
    const id = $("#edit-id-information").prop("editNode");
    const title = $("#edit-node-title").val();
    const description = $("#edit-node-description").val();

    if (title === this._title || description === this._description)
      this.changeStatus(id, 1);
  }

  workingHere(id, checked) {
    const initialState = $(`[editNode=${id}]`).prop('initialState');
    const status = Boolean(checked) === Boolean(initialState) ? 5.1 : 5.2;
    this.store = this.store.map(info => info.id === id ? { ...info, status } : info)
  }

  File(name, extname, type) {
    this.incrementId();

    const id = this.getId();

    this.addStack(id, NO_CHANGEMENT, null, { type });

    $("div#edit-file").append(editFileRender(id, name, extname, type));
  }

  /**
   * Add A new File by the button 'Add File'
   * @param {File} File
   * @memberof EditStore
   */
  addFile(File) {
    this.incrementId();

    const id = this.getId();

    const name = File.name;
    const extname = getFileExtension(name);

    const file = new XMLHttpRequest();
    file.append("file", File);

    this.addStack(id, ADD_SPEC, { file });
    $("div#edit-file").append(editFileRender(id, name, extname, SPECIFICATION_FILES));
  }

  removeFile(id) {
    const stack = this.retrieveStack(id);

    if (Math.floor(stack.status) === 2) {
      $("div#edit-file").remove(`#edit-id-${id}`);
      return this.removeStack(id);
    }

    switch (stack.initialState.type) {
      case MODELES3D_FILES:
        return this.changeStatus(stack.id, REMOVE_3D);
      case TEXTURE_FILES:
        return this.changeStatus(stack.id, REMOVE_TEXTURE);
      case SPECIFICATION_FILES:
        return this.changeStatus(stack.id, REMOVE_SPEC);
      default:
        return null;
    }
  }

  /**
   * Transfert The node File
   * @param {Number} id The identification of the file
   * @param {String} value The Value of the changement
   * @memberof EditStore
   */
  tranfertFile(id, value) {
    const stack = this.retrieveStack(id);

    if (stack.initialState) {
      const { type } = stack.initialState;
      switch (value) {
        case MODELES3D_FILES:
          this.changeStatus(stack.id, type === MODELES3D_FILES ? NO_CHANGEMENT : TRANSFERT_SPEC_TO_3D);
        case TEXTURE_FILES:
          this.changeStatus(stack.id, type === TEXTURE_FILES ? NO_CHANGEMENT : TRANSFERT_SPEC_TO_TEXTURE);
        case SPECIFICATION_FILES:
          this.changeStatus(stack.id, type === SPECIFICATION_FILES ? NO_CHANGEMENT : TRANSFERT_TEXTURE_TO_SPEC);
        default:
          return null;
      }
    } else {
      switch (value) {
        case MODELES3D_FILES:
          return this.changeStatus(stack.id, 2.1);
        case TEXTURE_FILES:
          return this.changeStatus(stack.id, 2.2);
        case SPECIFICATION_FILES:
          return this.changeStatus(stack.id, 2.3);
        default:
          return null;
      }
    }
  }

  /**
   * Create a worker (user who can see this node) stack.
   * @param {string} userId
   * @param {string} name
   * @param {Boolean} workHere
   * @memberof EditStore
   */
  Worker(userId, name, workHere) {
    this.incrementId();

    const id = this.getId();
    this.addStack(id, NO_CHANGEMENT, { nodeId, userId }, { workingHere })

    $("div#edit-worker").append(editFileRender(id, userId, name, workHere));
  }

  /**
   * Add a worker from the list of user who are working in this node.
   * @param {string} id
   * @param {string} workHere
   * @memberof EditStore
   */
  addWorker(id, workHere) {
    const { initialState } = this.retrieveStack(id)
    const status = initialState.workingHere === workHere ? NO_CHANGEMENT : ADD_ACCESS;
    this.changeStatus(id, status);
  }

  /**
   * Remove a worker from the list of user who are working in this node
   * @param {string} id
   * @param {string} workHere
   * @memberof EditStore
   */
  removeWorker(id, workHere) {
    const { initialState } = this.retrieveStack(id)
    const status = initialState.workingHere === workHere ? NO_CHANGEMENT : REMOVE_ACCESS;
    this.changeStatus(id, status);
  }

  inform() { }
}
