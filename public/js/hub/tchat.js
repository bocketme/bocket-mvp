let allTchats = [];
let selectedTchat = {};
let deletedTchat = {};
let userId = 0;
let userName = '';

$(document).ready(() => {
  getUserId();
  getAllUsers();
  getJoinedTchats();
});

$('.messages').animate({ scrollTop: $(document).height() }, 'fast');

$('#profile-img').click(() => {
  $('#status-options').toggleClass('active');
});

$('#addcontact').click(() => {
  document.getElementById('new-tchat-form').style.display = 'block';
  document.getElementById('new-tchat-form').classList.add('blurred');
  document.getElementById('journal-log').style.display = 'none';
  document.getElementById('tchat-content').style.display = 'none';
});

$('#create-tchat-btn').on('click', (e) => {
  let title = $('#tchat-title-form').val();
  const newTchat = { title, users: [] };
  const listItems = $('#social-users-list li');
  listItems.each((idx, li) => {
    const idUser = $(li).attr('id').split('-')[0];
    if (document.getElementById(`${idUser}-check`).checked) {
      newTchat.users.push(idUser);
      title = `${title + $(li).text()}, `;
    }
  });
  title += userName;
  if (newTchat.title === '' || newTchat.title === undefined)
    newTchat.title = title;
  socket.emit('[Tchat] - add', newTchat);
  document.getElementById('cancel-tchat-btn').click();
});

$('#cancel-tchat-btn, #close-add-modal').on('click', (e) => {
  $('#tchat-title-form').val('');
  document.getElementById('new-tchat-form').style.display = 'none';
  document.getElementById('new-tchat-form').classList.remove('blurred');

    const listItems = $('#social-users-list li');
  listItems.each((idx, li) => {
    const idUser = $(li).attr('id').split('-')[0];
    document.getElementById(`${idUser}-check`).checked = false;
  });
});

$('.expand-button').click(() => {
  $('#profile').toggleClass('expanded');
  $('#contacts').toggleClass('expanded');
});

$('#status-options ul li').click(function () {
  $('#profile-img').removeClass();
  $('#status-online').removeClass('active');
  $('#status-away').removeClass('active');
  $('#status-busy').removeClass('active');
  $('#status-offline').removeClass('active');
  $(this).addClass('active');

  if ($('#status-online').hasClass('active')) {
    $('#profile-img').addClass('online');
  } else if ($('#status-away').hasClass('active')) {
    $('#profile-img').addClass('away');
  } else if ($('#status-busy').hasClass('active')) {
    $('#profile-img').addClass('busy');
  } else if ($('#status-offline').hasClass('active')) {
    $('#profile-img').addClass('offline');
  } else {
    $('#profile-img').removeClass();
  }

  $('#status-options').removeClass('active');
});

function newMessage() {
  const message = $('.message-input input').val();
  if ($.trim(message) == '') {
    return false;
  }
  socket.emit('[Message] - add', message, selectedTchat._id);
}

socket.on('[Message] - confirmMessage', (message) => {
  addMessage(message);
});

function addMessage(message) {
  let date = new Date(message.date);
  if (String(message.author._id) === userId) {
    $(`<li class="sent"><p class="msg-info"><strong>${message.author.completeName}</strong><span class="message-data-time" >${date.toDateString()}</span></p><p class="message-content">${message.content}</p></li>`).appendTo($('.messages ul'));
  } else {
    $(`<li class="replies"><p class="msg-info"><strong>${message.author.completeName}</strong><span class="message-data-time" >${date.toDateString()}</span></p><p class="message-content">${message.content}</p></li>`).appendTo($('.messages ul'));
  }

  $('.message-input input').val(null);
  $('.messages').animate({ scrollTop: $(document).height() }, 'fast');
}

$('.submit').click(() => {
  newMessage();
});

$(window).on('keydown', (e) => {
  if (e.which == 13) {
    newMessage();
    return false;
  }
});

function addContactCard(tchat) {
  const date = new Date(tchat.date);
  if (tchat !== undefined) {
    const lastMessage = (tchat.messages.length > 0 ? tchat.messages[tchat.messages.length - 1].content : 'No previous messages..');
    $('#contacts-list').append(`<li id="${tchat._id}" class="contact">\n` +
        '                    <div class="wrap">\n' +
        '                        <i class="material-icons">comment</i>\n' +
        `<a id="${tchat._id}-delete" href=#  style="float: right;cursor: pointer"><i class="material-icons" style="color: black">clear</i></a>\n` +
        '                        <div class="meta">\n' +
        `                            <p class="name">${tchat.title}</p>\n` +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </li>');
  }

  $(`#${tchat._id}`).on('click', () => {
    if (selectedTchat._id !== tchat._id) {
      $('.messages-list').empty();
      document.getElementById('journal-log').style.display = 'none';
      document.getElementById('tchat-content').style.display = 'block';
      document.getElementById('new-tchat-form').style.display = 'none';

      socket.emit('[Tchat] - fetchById', tchat);
    }
    selectedTchat = tchat;
  });

  $(`#${tchat._id}-delete`).on('click', () => {
    deletedTchat = tchat;
    document.getElementById('confirm-tchat-modal').style.display = 'block';
    document.getElementById('confirm-tchat-modal').classList.add('blurred');
  });

  $('#confirm-tchat-rm-btn').on('click', () => {
    socket.emit('[Tchat] - remove', deletedTchat);
    document.getElementById('new-tchat-form').style.display = 'none';
    document.getElementById('journal-log').style.display = 'block';
    document.getElementById('tchat-content').style.display = 'none';
    document.getElementById('cancel-tchat-rm-btn').click();
  });

  $('#cancel-tchat-rm-btn, #close-confirm-modal').on('click', () => {
    document.getElementById('confirm-tchat-modal').style.display = 'none';
    document.getElementById('confirm-tchat-modal').classList.remove('blurred')
  });
}

socket.on('[Tchat] - confirmAdd', tchat => {
  if (tchat.users.findIndex(elem => elem === userId) !== -1) {
    addContactCard(tchat);
    socket.emit('[Tchat] - joinRoom', String(tchat._id));
  }
});

socket.on('[Tchat] - remove', deletedTchat => {
  allTchats = allTchats.filter(tchat => tchat._id !== deletedTchat._id);
  $(`#${deletedTchat._id}`).remove();
});

socket.on('[Tchat] - fetchById', (tchat) => {
  if (tchat != null) {
    $('#tchat-title').text(tchat.title);
    if (tchat != null && tchat !== undefined) {
      selectedTchat = tchat;
      for (message of tchat.messages) {
        console.log('Message: ', message);
        addMessage(message);
      }
    }
  } else {
    console.error('[Error] Fetched tchat is null');
  }
});

socket.on('[Users] - fetchById', (user) => {
  if (user !== null && user !== undefined)
    $('#social-users-list').append(`<li id="${user._id}-contact"><a href="#!"><input type="checkbox" class="check-with-label" id="${user._id}-check"/><label class="label-for-check" for="${user._id}-check">${user.completeName}</label></a></li>`);
});

function sortTchats(tchats) {
  $('#contacts-list').empty();
  for (let i = 0; i < tchats.length; i++) {
    if (tchats[i].users.findIndex(elem => elem === userId) !== -1) {
      addContactCard(tchats[i]);
      socket.emit('[Tchat] - joinRoom', String(tchats[i]._id));
    }
  }
}

function getAllTchats() {
  socket.emit('[Tchat] - fetch');
  socket.on('[Tchat] - fetch', (tchats) => {
    if (tchats !== null && tchats !== undefined) {
      allTchats = tchats.slice();
      sortTchats(tchats);
    }
  });
}

function getJoinedTchats() {
  socket.emit('[Tchat] - fetchJoinedTchat');
  socket.on('[Tchat] - fetch', (tchats) => {
    if (tchats !== null && tchats !== undefined) {
      allTchats = tchats.slice();
      sortTchats(tchats);
    }
  });
}

function getUserId() {
  socket.emit('[User] - getCurrentUser');
  socket.on('[User] - getCurrentUser', (user) => {
    userId = user._id;
    userName = user.completeName;
/*
    $('#profile-name').text(user.completeName);
*/
  });
}

function getAllUsers() {
  socket.emit('[Users] - fetchFromWorkspace');
  socket.on('[Users] - fetchFromWorkspace', (users) => {
    users.forEach((user) => {
      socket.emit('[Users] - fetchById', user._id);
    });
  });
}
