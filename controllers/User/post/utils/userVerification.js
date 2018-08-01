const tasks = [
  checkEmail,
  checkPassword,
  checkCompleteName,
];

function verification(body) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i](body) === false) throw new Error(`Error occured on signin up user on task : ${tasks[i].name}`)
  }
}

module.exports = verification;

const regexName = /[A-Za-z/-]+[A-Za-z/-]+/;
const regexPassword = /^(?=.*\W)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,26}$/
const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


function checkCompleteName(body) {
  let { completeName } = body;
  completeName = completeName.toLowerCase();
  completeName = completeName.trim();
  body.completeName = escape(completeName);
  return regexName.test(body.completeName);
}

function checkPassword(body) {
  body.password = escape(body.password);
  return regexPassword.test(body.password);
}

function checkEmail(body) {
  body.email = escape(body.email);
  return regexEmail.test(body.email);
}
