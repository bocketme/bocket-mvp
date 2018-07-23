class EditStore {
  constructor (info, files, workers, nodeId, type) {
    this._id = 0;
    this.blocked = false;

    this.store = [];

    this._type = type;
    this._nodeId = nodeId;

    this.launchConvert = false;

    this._verify = [];

    this._info = $("div#edit-info");
    this._file = $("div#edit-file");
    this._worker = $("div#edit-worker");

    this._info.html("");
    this._file.html("");
    this._worker.html("");

    this._save = $("#edit-save");

    this.reducer = EditReducer;

    $("#edit-node-title").html(`${this._type === "part" ? "Edit Part" : "Edit Assembly"}`)

    this.initializeTitle(info.name, info.description);
    files.forEach(({ name, extname, type }) => this.File(name, extname, type));
    workers.forEach(({ userId, completeName, workHere }) => this.Worker(userId, completeName, workHere));
  }

  getId() { return this._id; }

  incrementId() { this._id++; }

  retrieveStack(_id) {
    return this.store.find(({ id }) => id === _id);
  }

  addStack(id, status, data = {}, initialState = null) {

    data.nodeId = this._nodeId;

    if (id !== undefined && status !== undefined)
      this.store = [...this.store, { id, status, data, initialState }];
  }

  removeStack(_id) { this.store = this.store.filter(({ id }) => _id !== id); }

  changeStatus(id, status) {
    this.store = this.store
      .map(store => store.id === id ? { ...store, status } : store);
  }

  initializeTitle(title, description = "") {
    this.incrementId();
    this._title = title;
    this._description = description;

    const id = this.getId();

    this.addStack(id, NO_CHANGEMENT);

    $("div#edit-info").append(editInfoRender(id, title, description));
  }

  changeInfo() {
    const id = Number($("#edit-id-information").attr("editNode"));
    const title = $("#edit-node-title").val();
    const description = $("#edit-node-description").val();

    const changement = title === this._title && description === this._description
    this.changeStatus(id, changement ? 0 : 1)
  }

  workingHere(id, checked) {
    const initialState = $(`[editNode=${id}]`).prop('initialState');
    const status = Boolean(checked) === Boolean(initialState) ? 5.1 : 5.2;
    this.store = this.store.map(info => info.id === id ? { ...info, status } : info)
  }

  File(name, extname, type) {
    this.incrementId();

    const id = this.getId();


    this.addStack(id, NO_CHANGEMENT, { cibledFile: name, extname }, { type });

    $("div#edit-file").append(editFileRender(id, name, extname, type, this._type));
    $(`select[editNode="${id}"]`).material_select();
    $('.truncate.tooltipped').tooltip({ delay: 50 });
  }

  /**
   * Add A new File by the button 'Add File'
   * @param {File} File
   * @memberof EditStore
   */
  addFile(data) {
    if (data instanceof File) {
      this.incrementId();

      const id = this.getId();

      const name = data.name;
      const extname = '.' + getFileExtension(name);

      const file = new FormData();
      file.append("file", data);

      this.addStack(id, ADD_SPEC, { file, fileTypeMime: data.type, fileName: data.name });
      $("div#edit-file").append(editFileRender(id, name, extname, SPECIFICATION_FILES, this._type));
      $(`select[editNode="${id}"]`).material_select();
    } else if (typeof (data) === "number") {
      this.tranfertFile(Number(data), $(`select[editNode=${data}]`).val())
    }
    this.inform();
  }

  removeFile(id) {
    const stack = this.retrieveStack(id);

    const { extname } = stack.data

    if (Math.floor(stack.status) === 2) {
      $(`#edit-id-${id}`).remove();
      this.removeStack(id);
    } else {
      switch (typeFile(extname)) {
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
    this.inform();
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
          break;
        case TEXTURE_FILES:
          this.changeStatus(stack.id, type === MODELES3D_FILES ? NO_CHANGEMENT : TRANSFERT_SPEC_TO_TEXTURE);
          break;
        case SPECIFICATION_FILES:
          this.changeStatus(stack.id, type === SPECIFICATION_FILES ? NO_CHANGEMENT : TRANSFERT_TEXTURE_TO_SPEC);
          break;
        default:
          return null;
      }
    } else {
      switch (value) {
        case MODELES3D_FILES:
          this.changeStatus(stack.id, 2.1);
          break;
        case TEXTURE_FILES:
          this.changeStatus(stack.id, 2.2);
          break;
        case SPECIFICATION_FILES:
          this.changeStatus(stack.id, 2.3);
          break;
        default:
          return null;
      }
    }

    this.inform();
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
    this.addStack(id, NO_CHANGEMENT, { userId }, { workHere })

    $("div#edit-worker").append(editWorkerRender(id, userId, name, workHere));
  }

  /**
   * Add a worker from the list of user who are working in this node.
   * @param {string} id
   * @param {string} workHere
   * @memberof EditStore
   */
  editWorker(id, workHere) {
    const { initialState } = this.retrieveStack(id)
    const status = initialState.workingHere === workHere ? NO_CHANGEMENT : ADD_ACCESS;
    this.changeStatus(id, status);
  }

  save() {
    this.store.forEach(stack => this.reducer(stack.id, stack.data, stack.status))

  }

  finished(id) {
    this._verify[id] = true;
    this.verify();
  }

  error(id, message = "") {
    $("#edit-error-message").html(`<p class="center-align" style="color: red;">${message === "" ? "Some error occured, please correct them." : message}</p>`);
    this._verify[id] = false;
    this.verify();
  }

  verify() {
    if (this._verify.length === this.changes) {
      if (this.launchConvert) {
        const convertRequest = new XMLHttpRequest();
        convertRequest.open("PUT", `/node/${nodeId}/convert`);
        convertRequest.send();
      }  
      if (!this.verify.includes(false))
        $("#edit-node").modal("close");
    }

  }

  cancel() {
    return this.store.find(({ status }) => status !== 0) === null || this.verify.includes(false);
  }

  inform() {

    $("#edit-error-message").html("");
    this._save.prop("disabled", false);

    if (this._type === "part") {
      $(".file-ensemble").css("background-color", "inherit");
      const File = this._file.find("select");
      let files3D = [];
      File.each(function () {
        $(this).val() === MODELES3D_FILES && $(this).prop("disabled") === false ? files3D.push($(this)) : null
      });
      if (!(files3D.length === 1)) {
        files3D.forEach(file => $(file).parent(".file-ensemble").css("background-color", "red"));
        $("#edit-error-message").append(`<p class="center-align" style="color: red;">You can only have 1 3D Model, Please put the rest as a specification.</p>`);
        this._save.prop("disabled", true);
      }
    }
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

}
