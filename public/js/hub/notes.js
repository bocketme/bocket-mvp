$(document).ready(() => {
  /*
  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('side-info').style.display = 'block';
    console.log('add Note');
  });
*/

  $('#addNoteButton').on('click', () => {
    console.log('Note well added');
    // Insérer fct de Nadhir
    const displayValue = document.getElementById('note-card-form').style.getPropertyValue('display');
    console.log(displayValue);
    document.getElementById('note-card-form').style.display = (displayValue === 'block' ? 'none' : 'block');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#cancel-note-button').on('click', () => {
    console.log('Node canceled');
    document.getElementById('note-content-input').value = '';
    document.getElementById('note-title-input').value = '';
    document.getElementById('check-if-important').checked = false;
    document.getElementById('note-card-form').style.display = 'none';
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
    // Doit call la fonction d'ajouts dans le back
  });

  $('#show-notes').on('click', () => {
    const displayValue = document.getElementById('side-info').style.getPropertyValue('display');
    console.log(displayValue);
    document.getElementById('side-info').style.display = (displayValue === 'block' ? 'none' : 'block');
    console.log('show-notes');
  });
});

function clickedList()  {
  console.log('JAI CLIQUE');
}

function removeNote() {
  console.log('Jai suppr la note');
}