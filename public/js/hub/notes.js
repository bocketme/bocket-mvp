var isAnnotationMode = false;
var isHidden = true;
var HasClicked = false;

$(document).ready(() => {
  /*
  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('side-info').style.display = 'block';
    console.log('add Note');
  });
*/

  $('#addNoteButton').on('click', () => {
    console.log('isAnnotationMode Before : ' + isAnnotationMode);
    isAnnotationMode = (isAnnotationMode === true ? false : true);
    console.log('isAnnotationMode After : ' + isAnnotationMode);
    if (isAnnotationMode === true) {
      console.log("ICI");
      document.getElementById('addNoteButton').style.backgroundColor = 'red';
      document.getElementById('add-note-icon').innerHTML = 'clear';
      var evt = new Event("add-annotation");
      document.dispatchEvent(evt);
    } else {
      console.log("LA");
      document.getElementById('cancel-note-button').click();
    }
    // document.getElementById('note-card-form').style.display = (displayValue === 'block' ? 'none' : 'block');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#hideNoteButton').on('click', () => {

    // document.getElementById('note-card-form').style.display = (displayValue === 'block' ? 'none' : 'block');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#cancel-note-button').on('click', () => {
    console.log('Node canceled');
    document.getElementById('note-content-input').value = '';
    document.getElementById('note-title-input').value = '';
    document.getElementById('check-if-important').checked = false;
    document.getElementById('note-card-form').style.display = 'none';
    document.getElementById('addNoteButton').style.backgroundColor = '#4A90E2';
    document.getElementById('add-note-icon').innerHTML = 'add';
    if (HasClicked === true) {
      // Call l'event Pour supprimer l'annotation coté viewer 
      var evt = new Event("del-last-annotation");
      document.dispatchEvent(evt);
    } else {
      var evt = new Event("close-annotation-mode");
      document.dispatchEvent(evt);
    }
    isAnnotationMode = false;
    HasClicked = false;
    // Ferme la note et ne l'ajoute pas dans la db
  });

  $('#post-note-button').on('click', () => {
    const title = document.getElementById('note-title-input').value;
    const content = document.getElementById('note-content-input').value;
    const isImportant = document.getElementById('check-if-important').checked;
    console.log(title);
    console.log(content);
    console.log(isImportant);
    document.getElementById('note-card-form').style.display = 'none';
    if (isImportant) {
      $('#note-list').append(`${'<li class="collection-item-note">\n' +
          '            <div class="note-important">\n' +
          '                <p class="note-title"><strong>'}${title}</strong><a href=# onclick="removeNote()" style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
          `                <p class="note-content">${content}</p>\n` +
          '            </div>\n' +
          '        </li>');
          var evt = new CustomEvent('change-material', { 'detail': 'I' });
          document.dispatchEvent(evt);
    } else {
      $('#note-list').append(`${'<li class="collection-item-note">\n' +
            '            <div class="note">\n' +
            '                <p class="note-title"><strong>'}${title}</strong><a href=# onclick="removeNote()" style="float: right;cursor: pointer"><i class="material-icons">clear</i></a></p>\n` +
            `                <p class="note-content">${content}</p>\n` +
            '            </div>\n' +
            '        </li>');
    }
    document.getElementById('note-content-input').value = '';
    document.getElementById('note-title-input').value = '';
    document.getElementById('check-if-important').checked = false;
    document.getElementById('addNoteButton').style.backgroundColor = '#4A90E2';
    isAnnotationMode = false;
    HasClicked = false;
    // Doit call la fonction d'ajouts dans le back
  });

  $('#show-notes').on('click', () => {
    const displayValue = document.getElementById('side-info').style.getPropertyValue('display');
    console.log(displayValue);
    document.getElementById('side-info').style.display = (displayValue === 'block' ? 'none' : 'block');
    console.log('show-notes');
    isHidden = (isHidden === true ? false : true);
    if (isHidden === true) {
      var evt = new Event("hide-annotations");
      document.dispatchEvent(evt);
    } else {
      var evt = new Event("show-annotations");
      document.dispatchEvent(evt);
    }
  });
});

function clickedList()  {
  console.log('JAI CLIQUE');
}

function removeNote() {
  console.log('Jai suppr la note');
}

document.addEventListener('annotation3D-added', (e) => {
  if (e.detail !== null) {
    let annotation = e.detail;
    console.log("JAI RECU LEVENT d'ajout d'annotation : " + e.detail.name);
    document.getElementById('note-card-form').style.display = 'block';
    HasClicked = true;
  } else {
    var evt = new Event("add-annotation");
    document.dispatchEvent(evt);
    console.log('e.detail == null');
  }
}, false)
