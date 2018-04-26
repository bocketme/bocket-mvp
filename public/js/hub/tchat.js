let allTchats = [];
let selectedTchat = 0;
let userId;

$(document).ready(() => {
  getUserId();
  // getAllTchats();
  getJoinedTchats();
});

$('.messages').animate({ scrollTop: $(document).height() }, 'fast');

$('#profile-img').click(() => {
  $('#status-options').toggleClass('active');
});

$('#addcontact').click(() => {
  const tchat = { title: 'General', messages: [], users: [] };
  socket.emit('[Tchat] - addGeneralTchat', tchat);
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
  socket.emit('[Message] - add', message, selectedTchat);
}

socket.on('[Message] - confirmMessage', (message) => {
  addMessage(message);
});

function addMessage(message) {
  if (String(message.author) === userId) {
    $(`<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>${message.content}</p></li>`).appendTo($('.messages ul'));
    $('.contact.active .preview').html('<span>You: </span>' + message.content);
  } else {
    $(`<li class="replies"><img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="" /><p>${message.content}</p></li>`).appendTo($('.messages ul'));
    $('.contact.active .preview').html('<span>'+ message.author +': </span>' + message.content);
  }

  $('.message-input input').val(null);
  $('.contact.active .preview').html('<span>You: </span>' + message.content);
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
        '                        <span class="contact-status online"></span>\n' +
        '                        <img src="http://emilcarlsson.se/assets/louislitt.png" alt="" />\n' +
        '                        <div class="meta">\n' +
        `                            <p class="name">${tchat.title}</p>\n` +
        `                            <p class="preview">${lastMessage}</p>\n` +
        '                        </div>\n' +
        '                    </div>\n' +
        '                </li>');
  }

  $(`#${tchat._id}`).on('click', () => {
    if (selectedTchat !== tchat._id) {
      $('.messages-list').empty();
      document.getElementById('journal-log').style.display = 'none';
      document.getElementById('tchat-content').style.display = 'block';
      socket.emit('[Tchat] - fetchById', tchat);
    }
    selectedTchat = tchat._id;
  });
}

socket.on('[Tchat] - confirmAdd', tchat => {
  addContactCard(tchat);
  socket.emit('[Tchat] - joinRoom', String(tchats[i]._id));
});

socket.on('[Tchat] - remove', deletedTchat => {
  allTchats = allTchats.filter(tchat => tchat._id !== deletedTchat._id);
  $(`#${deletedTchat._id}`).remove();
});

socket.on('[Tchat] - fetchById', (tchat) => {
  $('#tchat-title').text(tchat.title);
  if (tchat != null && tchat !== undefined) {
    selectedTchat = tchat._id;
    for (message of tchat.messages) {
      addMessage(message);
    }
  }
});

function sortTchats(tchats) {
  $('#contacts-list').empty();
  for (let i = 0; i < tchats.length; i++) {
    addContactCard(tchats[i]);
    console.log('IDX:', i);
    socket.emit('[Tchat] - joinRoom', String(tchats[i]._id));
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
    $('#profile-name').text(user.completeName);
  });
}
