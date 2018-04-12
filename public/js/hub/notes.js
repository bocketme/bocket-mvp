$(document).ready(() => {
  const notes = $('#notes');

  $('#notes-context-menu').on('click', '#new_note', () => {
    document.getElementById('side-info').style.display = 'block';
    console.log('add Note');
  });

  $('#addNoteButton').on('click', () => {
    console.log('Note well added');
    // Insérer fct de Nadhir
    let displayValue = document.getElementById('note-card-form').style.getPropertyValue('display');
    console.log(displayValue);
    document.getElementById('note-card-form').style.display = (displayValue === 'block' ? 'none' : 'block');
    // Ferme la note et l'ajoute dans la db
    // A mixer avec la fct de Nadhir
  });

  $('#cancelNoteButton').on('click', () =>{
    console.log('Node canceled');
    document.getElementById('note-content').value = '';
    document.getElementById('note-title').value = '';
    // Ferme la note et ne l'ajoute pas dans la db
  });

  $('#show-notes').on('click', () => {
    let displayValue = document.getElementById('side-info').style.getPropertyValue('display');
    console.log(displayValue);
    document.getElementById('side-info').style.display = (displayValue === 'block' ? 'none' : 'block');
    console.log('show-notes');
  });


});
