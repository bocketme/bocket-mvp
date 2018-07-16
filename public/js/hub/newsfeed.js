
$(document).ready(() => {
  getAllNewsfeed();
});

$('#news-feed').on('addNews', (event, type, method, target, role) => {
  const news = {
    type,
    content: {
      method,
      target,
      role,
    },
  };
  socket.emit('[Newsfeed] - add', news);
});

function getAllNewsfeed() {
  socket.emit('[Newsfeed] - fetch');
  $('#all-feeds-list').empty();
  $('#object-feeds-list').empty();
  $('#team-feeds-list').empty();
  $('#annotation-feeds-list').empty();
}

socket.on('[Newsfeed] - fetch', (results) => {
  for (let i = 0; i < results.length; i++) {
    if (results[i].type === 'PART'
          || results[i].type === 'USER'
          || results[i].type === 'ASSEMBLY'
          || results[i].type === 'ANNOTATION') {
      addNews(results[i]);
    }
  }
});


socket.on('[Newsfeed] - confirmNewsfeed', (newsfeed) => {
  if (newsfeed.type === 'PART'
        || newsfeed.type === 'USER'
        || newsfeed.type === 'ASSEMBLY'
        || newsfeed.type === 'ANNOTATION') {
    addNews(newsfeed);
  }
});

$('#button-save').on('click', (event) => {
  const nodeId = idOfchoosenNode;
  const name = $(`#${nodeId} > .p-node`).text();
  if ($(`#${nodeId}-body`).length) {
    $('#news-feed').trigger('addNews', ['ASSEMBLY', 'UPDATE', name, '']);
  } else {
    $('#news-feed').trigger('addNews', ['PART', 'UPDATE', name, '']);
  }
});

$('#show-all-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').show();
  $('#object-feeds').hide();
  $('#team-feeds').hide();
  $('#annotation-feeds').hide();
});

$('#show-object-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').hide();
  $('#object-feeds').show();
  $('#team-feeds').hide();
  $('#annotation-feeds').hide();
});

$('#show-team-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').hide();
  $('#object-feeds').hide();
  $('#team-feeds').show();
  $('#annotation-feeds').hide();
});

$('#show-annotation-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').hide();
  $('#object-feeds').hide();
  $('#team-feeds').hide();
  $('#annotation-feeds').show();
});

function getNewsText(type, author, content, icon) {
  switch (type) {
    case 'PART':
      switch (content.method) {
        case 'ADD':
          return `<strong>${author}</strong>${icon} added a new part : <span style="color: #5f88ef">${content.target}</span>`;
        case 'DELETE':
          return `<strong>${author}</strong>${icon} deleted a part : <span style="color: #5f88ef">${content.target}</span>`;
        case 'UPDATE':
          return `<strong>${author}</strong>${icon} modified a part : <span style="color: #5f88ef">${content.target}</span>`;
        default:
          break;
      }
      break;
    case 'ASSEMBLY':
      switch (content.method) {
        case 'ADD':
          return `<strong>${author}</strong>${icon} added a new assembly : <span style="color: #38761d">${content.target}</span>`;
        case 'DELETE':
          return `<strong>${author}</strong>${icon} deleted an assembly : <span style="color: #38761d">${content.target}</span>`;
        case 'UPDATE':
          return `<strong>${author}</strong>${icon} modified an assembly : <span style="color: #38761d">${content.target}</span>`;
        default:
          break;
      }
      break;
    case 'USER':
      switch (content.method) {
        case 'ADD':
          return `<span style="color: #38761d">${content.target}</span> has joined the team. Welcome ! `;
        case 'DELETE':
          return `<span style="color: #38761d">${content.target}</span> has left the team. Bye Bye…`;
        case 'UPDATE':
          return `<span style="color: #38761d">${content.target}</span> has changed role in the Workspace `;
        default:
          break;
      }
      break;
    case 'ANNOTATION':
      switch (content.method) {
        case 'ADD':
          return `<strong>${author}</strong>${icon} added an annotation : <span style="color: #e69138">${content.target}</span>`;
        case 'DELETE':
          return `<strong>${author}</strong>${icon} deleted an annotation : <span style="color: #e69138">${content.target}</span>`;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

function getUserAvatar(author, classes) {
  return `<img data-name="${author}" class=" avatar profile-pic ${classes}"/>`;
}

function getIconAction(type, method) {
  if (method === 'ADD') {
    return '<i class="icon-action material-icons green-text text-lighten-2 tiny">add_circle</i>';
  } else if (method === 'DELETE') {
    return '<i class="icon-action material-icons red-text text-lighten-2 tiny">cancel</i>';
  } else if (method === 'UPDATE') {
    return '<i class="icon-action material-icons amber-text text-lighten-2 tiny">edit</i>';
  }
}

function addNews(newsfeed) {
  const date = new Date(newsfeed.date);
  const outputDate = `${date.getDate() + 1}/${date.getMonth()}/${date.getFullYear()} - ${
    date.getHours()}:${date.getMinutes()}`;
  const iconAction = getIconAction(newsfeed.type, newsfeed.content.method);
  const text = getNewsText(newsfeed.type, newsfeed.author.completeName, newsfeed.content, iconAction);
  const imgAvatar = getUserAvatar(newsfeed.author.completeName, 'circle');
  const html = '<li class="collection-item newsfeed avatar" >' +
        `           ${imgAvatar}<p style="display: inline-block" class="col s12"><span style="font-size: smaller">${outputDate}</span><br>${text}</p>` +
        // `           <a href="#!" class="secondary-content" >${imgAvatar}</a>` +
        '         </li>';
  $('#all-feeds-list').prepend(html);
  if (newsfeed.type === 'PART' || newsfeed.type === 'ASSEMBLY') {
    $('#object-feeds-list').prepend(html);
  } else if (newsfeed.type === 'USER') {
    $('#team-feeds-list').prepend(html);
  } else if (newsfeed.type === 'ANNOTATION') {
    $('#annotation-feeds-list').prepend(html);
  }
  $('.profile-pic').initial();
}
