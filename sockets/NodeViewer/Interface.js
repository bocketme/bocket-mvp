module.exports = loading = {
  on: {
    start: "[Viewer] - Start Workspace",
    save: "[Viewer] - Save",
    cancel: "[Viewer] - Cancel",
    file: "[Viewer] - File",
    update: "[Viewer] - Update",
    part: {
      get: "[Viewer] - Get Part",
      post: "[Viewer] - Post Part",
    }
  },
  emit: {
    updateMatrix: '[Viewer] - Update Matrix',
    cancel: "[Viewer] - Cancel",
    assembly: "[Viewer] - Add Assmbly",
    part: "[Viewer] - Add Part",
    delete: '[Viewer] - Delete',
    use: "[Viewer] - Add Existing",
    error: "[Viewer] - Error Loading"
  }
};
