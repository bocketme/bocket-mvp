class EditStack {
  /**
   * Creates an instance of EditStore.
   * @param {string} title
   * @param {string} nodeId
   * @param {Object} users
   * @param {string} users._id
   * @param {string} users.name
   * @param {string} users.
   * @memberof EditStore
   */
  constructor (title, nodeId, users) {
    /* Create the title */
    this._title = document.getElementById(EDIT_NODE.ID.TITLE);
    this._title.innerHTML = title

    this.nodeId = nodeId;

    this._status = {
      ERROR: -1,
      NULL: 0,
      NEED_UPLOAD: 1,
      NEED_REMOVED: 2,
      TO_3D: 3,
      TO_SPEC: 4,
      TO_TEXTURE: 5,
    }

    this._error = document.getElementById(EDIT_NODE.ID.ERROR);

    this._cancel = document.getElementById(EDIT_NODE.ID.CANCEL);

    this._save = document.getElementById(EDIT_NODE.ID.SAVE);

    this.stackId = 0;
    this.Stack = [];

    this.users = users;
  }

  get id() {
    return this.stackId;
  }

  get seachStack(id) {
    return this.Stack.find(({ _id }) => _id === id);
  }

  transferFile(status, originalState) {
    if (status === originalState)
      return null

    switch (status) {
      case TO_3D:
        this.addStack({});
      case TO_SPEC:
        this.addStack();
      case TO_TEXTURE:
        this.addStack();
      default:
        return null
    }
  }

  addStack({ _id, data, action, onDone, onError }) {
    this.Stack = [...this.Stack, { _id, data, action, onDone, onError }];
    this.inform();
    this.stackId++;
  }

  removeStack(id) {
    this.Stack = this.Stack.filter(({ _id }) => _id !== id);
    this.inform();
  }

  inform() {
    if (this.Stack.length > 0) {
      this._save.classList.add(DISABLED);
      this._cancel.setAttribute('href');
    } else {
      this._save.classList.add(DISABLED);
      this._cancel.setAttribute('href');
    }
  }

  reduceStack(i) {
    const { data, action, onDone, onError } = this.state[i];
    this.Stack = EditStack.EditReducer(data, action, onDone, onError);
  }
}

EditStack.EditReducer = EditReducer;


