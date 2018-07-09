import { isValid, isNotValid, hasanError } from './html';

/**
 * W
 * @class EditNode
 */
class EditNode {

  /**
   *Creates an instance of EditNode.
   * @param {Object} initialState
   * @param {string} initialState.id
   * @param {string} [initialState.name]
   * @param {string} [initialState.description='']
   * @param {Object} initialState.Files
   * @memberof EditNode
   */
  constructor (initialState) {
    const { id, Files, name = '', description = '' } = initialState
    this.state = {
      id,
      Files,
      info: {
        name,
        description,
      },
      status: {
        statusCode: 0,
        message: ''
      }
    }
  }

  /**
   *
   * @memberof EditNode
   */
  set valid(id) {
    const element = $(`.icon [editNode="${id}"]`);
    element.html(isValid);
  }

  set errorMessage(id, message) {
    const element = $(`.errormessage [editNode="${id}"]`);
    element.html(hasanError(message));
  }

  set error(id) {
    const element = $(`.icon [editNode="${id}"]`);
    element.html(isNotValid);
  }

  set errorGeneralMessage(message) {
    const element = $('#error-edit-message');
    element.html(message)
  }

  save() {

  }

  cancel() {

  }

  render() {

  }
}
