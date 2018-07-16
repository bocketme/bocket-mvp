let offset = 0;
const limit = 20;
let newsfeedLength = 0;


$(document).ready(() => {
  // getAllNewsfeed();
  $('#all-feeds-list').empty();
  getNextNews();
  $('.select').material_select();
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

function scrolled(o) {
  // visible height + pixel scrolled = total height
  if (o.offsetHeight + o.scrollTop === o.scrollHeight && offset <= newsfeedLength) {
    getNextNews();
  }
}

function getAllNewsfeed() {
  socket.emit('[Newsfeed] - fetch');
  $('#all-feeds-list').empty();
}

function getNextNews() {
  socket.emit('[Newsfeed] - fetch', offset, limit);
  offset += limit;
}

socket.on('[Newsfeed] - fetch', (results, length) => {
  newsfeedLength = length;
  $('#end-of-list').remove();
  for (let i = 0; i < results.length; i++) {
    if (results[i].type === 'PART'
          || results[i].type === 'USER'
          || results[i].type === 'ASSEMBLY'
          || results[i].type === 'ANNOTATION') {
      addNews(results[i], 'fetch');
    }
  }
  $('#all-feeds-list').append('<li id="end-of-list" class="collection-item center-align">There are no more news-feed to show :(</li>');
});


socket.on('[Newsfeed] - confirmNewsfeed', (newsfeed) => {
  if (newsfeed.type === 'PART'
        || newsfeed.type === 'USER'
        || newsfeed.type === 'ASSEMBLY'
        || newsfeed.type === 'ANNOTATION') {
    addNews(newsfeed, 'confirm');
  }
  offset += 1;
});

socket.on('[Newsfeed] - fetchNewNewsfeed', (newsfeed) => {
  if (newsfeed.type === 'PART'
      || newsfeed.type === 'USER'
      || newsfeed.type === 'ASSEMBLY'
      || newsfeed.type === 'ANNOTATION') {
    addNews(newsfeed, 'confirm');
  }
  offset += 1;
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

function showAllNews() {
  $('.part-class, .annotation-class, .assembly-class, .user-class').fadeIn(100);
}

function hideAllNews() {
  $('.part-class, .annotation-class, .assembly-class, .user-class').hide();
}

function showFilteredNews(type) {
  hideAllNews();
  switch (type) {
    case 'PART':
      $('.part-class').fadeIn(100);
      break;
    case 'ASSEMBLY':
      $('.assembly-class').fadeIn(100);
      break;
    case 'ANNOTATION':
      $('.annotation-class').fadeIn(100);
      break;
    case 'USER':
      $('.user-class').fadeIn(100);
      break;
    default:
      showAllNews();
      break;
  }
}

function handleChangeType(event) {
  const value = event.target.value;
  console.log(value);
  if (value === 'ALL') {
    showAllNews();
  } else {
    showFilteredNews(value);
  }
}

function checkIfHidden(type) {
  const value = $('#filter-select').val();
  console.log(value);
  if (value !== 'ALL') {
    showFilteredNews(value);
  }
}

function getNewsText(type, author, content) {
  switch (type) {
    case 'PART':
      switch (content.method) {
        case 'ADD':
          return `<strong>${author}</strong> added a new part : <span style="color: #5f88ef">${content.target}</span>`;
        case 'DELETE':
          return `<strong>${author}</strong> deleted a part : <span style="color: #5f88ef">${content.target}</span>`;
        case 'UPDATE':
          return `<strong>${author}</strong> modified a part : <span style="color: #5f88ef">${content.target}</span>`;
        default:
          break;
      }
      break;
    case 'ASSEMBLY':
      switch (content.method) {
        case 'ADD':
          return `<strong>${author}</strong> added a new assembly : <span style="color: #38761d">${content.target}</span>`;
        case 'DELETE':
          return `<strong>${author}</strong> deleted an assembly : <span style="color: #38761d">${content.target}</span>`;
        case 'UPDATE':
          return `<strong>${author}</strong> modified an assembly : <span style="color: #38761d">${content.target}</span>`;
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
          return `<strong>${author}</strong> added an annotation : <span style="color: #e69138">${content.target}</span>`;
        case 'DELETE':
          return `<strong>${author}</strong> deleted an annotation : <span style="color: #e69138">${content.target}</span>`;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

function getUserAvatar(author, classes) {
  return `<img data-name="${author}" class=" profile-pic ${classes}"/>`;
}

function getIconAction(type, method) {
  if (method === 'ADD') {
    return '<i class="icon-action material-icons green-text text-lighten-2 ">add_circle</i>';
  } else if (method === 'DELETE') {
    return '<i class="icon-action material-icons red-text text-lighten-2 ">cancel</i>';
  } else if (method === 'UPDATE') {
    return '<i class="icon-action material-icons amber-text text-lighten-2 ">edit</i>';
  }
}

function getClass(type) {
  switch (type) {
    case 'PART':
      return 'part-class';
    case 'ASSEMBLY':
      return 'assembly-class';
    case 'USER':
      return 'user-class';
    case 'ANNOTATION':
      return 'annotation-class';
    default:
      return 'no-class';
  }
}

function addNews(newsfeed, type) {
  const date = new Date(newsfeed.date);
  const outputDate = `${date.getDate() + 1}/${date.getMonth()}/${date.getFullYear()} - ${
    date.getHours()}:${date.getMinutes()}`;
  const iconAction = getIconAction(newsfeed.type, newsfeed.content.method);
  const text = getNewsText(newsfeed.type, newsfeed.author.completeName, newsfeed.content);
  const imgAvatar = getUserAvatar(newsfeed.author.completeName, 'circle');
  const specClass = getClass(newsfeed.type);
  const html = `<li class="collection-item newsfeed ${specClass}" >` +
                  '<div class="container-img">\n' +
                  `  ${imgAvatar}` +
                  `  <div class="overlay">${iconAction}</div>` +
                  '</div>' +
        `          <p class="item-content">${text}<br><span style="font-size: smaller">${outputDate}</span></p>` +
        '         </li>';
  if (type === 'fetch') {
    $('#all-feeds-list').append(html);
  } else {
    $('#all-feeds-list').prepend(html);
  }
  checkIfHidden();
  $('.profile-pic').initial();
}
