const querystring = require('querystring');
const http = require('http');
const util = require('util');
const fs = require('fs');
const emailRegex = require('./regex').email;

const pathname = 'users.txt';
const uid = util.promisify(require('uid-safe'));

const accountInformationsSeparator = ',';

const lineReader = require('readline').createInterface({
  input: fs.createReadStream(pathname),
});

const RED = '\033[0;31m';
const GREEN = '\033[0;32m';
const NC = '\033[0m';

function httpRequest(data, postOption) {
  return new Promise((resolve, reject) => {
    const post_req = http.request(postOption, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        reject(new Error('statusCode = ' + res.statusCode));
      } else {
        resolve();
      }
    });
    post_req.write(data);
    post_req.end();
  });
}

async function generateAccountInformations(email, completeName) {
  return querystring.stringify({
    workspaceName: await uid(8),
    password: await uid(8),
    organizationName: await uid(8),
    email,
    completeName,
  });
}

async function sendData(accInfo) {
  const post_options = {
    host: 'localhost',
    port: '8080',
    path: '/signup',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(accInfo),
    },
  };

  await httpRequest(accInfo, post_options);
}

async function createUsersWithFile(line) {
  const [email, completeName] = line.split(accountInformationsSeparator);

  if (!email || !completeName) {
    throw Error('Invalid line');
  } else if (!email.match(emailRegex)) {
    throw Error('Invalid Email');
  }
  const accInfo = await generateAccountInformations(email, completeName);
  await sendData(accInfo);
}

lineReader.on('line', (line) => {
  createUsersWithFile(line)
    .then(() => console.log(`${line} ${GREEN}OK${NC}`))
    .catch(error => console.log(`${line} ${RED}KO${NC}: ${error}`));
});
