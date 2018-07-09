
$(document).ready(() => {
  getAllNewsfeed();
});

$('#news-feed').on('addNews', (event, type, method, target) => {
  const news = {
    type,
    content: {
      method,
      target,
    },
  };
  socket.emit('[Newsfeed] - add', news);
});

function getAllNewsfeed() {
  socket.emit('[Newsfeed] - fetch');
  $('#all-feeds-list').empty();
  $('#object-feeds-list').empty();
  $('#team-feeds-list').empty();
}

socket.on('[Newsfeed] - fetch', (results) => {
  for (let i = 0; i < results.length; i++) {
    if (results[i].type === 'PART') {
      addPartNews(results[i]);
    } else if (results[i].type === 'USER') {
      addUserNews(results[i]);
    } else if (results[i].type === 'ASSEMBLY') {
      addAssemblyNews(results[i]);
    } else if (results[i].type === 'ANNOTATION') {
      addAnnotationNews(results[i]);
    }
  }
});


socket.on('[Newsfeed] - confirmNewsfeed', (newsfeed) => {
  if (newsfeed.type === 'PART') {
    addPartNews(newsfeed);
  } else if (newsfeed.type === 'USER') {
    addUserNews(newsfeed);
  } else if (newsfeed.type === 'ASSEMBLY') {
    addAssemblyNews(newsfeed);
  } else if (newsfeed.type === 'ANNOTATION') {
    addAnnotationNews(newsfeed);
  }
  console.log('NEEWSFEED', newsfeed);
});

$('#show-all-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').show();
  $('#object-feeds').hide();
  $('#team-feeds').hide();
});

$('#show-object-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').hide();
  $('#object-feeds').show();
  $('#team-feeds').hide();
});

$('#show-team-feeds').on('click', (event) => {
  event.preventDefault();
  $('#all-feeds').hide();
  $('#object-feeds').hide();
  $('#team-feeds').show();

  // TMP !!!!
  $('#news-feed').trigger('addNews', ['PART', 'ADD', 'Object1']);
});

function getNewsText(type, method, author, target) {
  switch (type) {
    case 'PART':
      switch (method) {
        case 'ADD':
          return `${author} added a new part : ${target}`;
        case 'DELETE':
          return `${author} deleted a part : ${target}`;
        case 'UPDATE':
          return `${author} modified a part : ${target}`;
        default:
          break;
      }
      break;
    case 'ASSEMBLY':
      switch (method) {
        case 'ADD':
          return `${author} added a new assembly : ${target}`;
        case 'DELETE':
          return `${author} deleted an assembly : ${target}`;
        case 'UPDATE':
          return `${author} modified an assembly : ${target}`;
        default:
          break;
      }
      break;
    case 'USER':
      switch (method) {
        case 'ADD':
          return `${target} has joined the team. Welcome ! `;
        case 'DELETE':
          return `${target} has left the team. Bye Bye…`;
        case 'UPDATE':
          return `${target} has changed role in the Workspace `;
        default:
          break;
      }
      break;
    case 'ANNOTATION':
      switch (method) {
        case 'ADD':
          return `${author} added an annotation in ${target}`;
        case 'DELETE':
          return `${author} deleted an annotation in ${target}`;
        default:
          break;
      }
      break;
    default:
      break;
  }
}

function addPartNews(newsfeed) {
  const date = new Date(newsfeed.date);
  const outputDate = `${date.getDate() + 1}/${date.getMonth()}/${date.getFullYear()} - ${
    date.getHours()}:${date.getMinutes()}`;
  const text = getNewsText(newsfeed.type, newsfeed.content.method, newsfeed.author.completeName, newsfeed.content.target);

  const html = '<li class="collection-item avatar">' +
      '           <img src="/img/defaultAvatar.jpg" alt="" class="circle">' +
      // `           <span class="title">${newsfeed.content.target}</span>` +
      `           <p>${text}</p>` +
      `           <a href="#!" class="secondary-content">${outputDate}</a>` +
      '         </li>';
  $('#all-feeds-list').prepend(html);
  console.log('Part', newsfeed);
}

function addUserNews(newsfeed) {
  console.log('User', newsfeed);
}

function addAssemblyNews(newsfeed) {
  console.log('Assembly', newsfeed);
}

function addAnnotationNews(newsfeed) {
  console.log('Annotation', newsfeed);
}
